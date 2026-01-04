// Split Exercises
const exercises = {
    "Chest & Back":["Bench Press","Incline DB Press","Barbell Rows","Pull-ups","Deadlifts","Chest Flyes"],
    "Shoulders & Arms":["Overhead Press","Lateral Raises","Barbell Curls","Skullcrushers","Hammer Curls","Dips"],
    "Legs":["Squats","Leg Press","RDLs","Leg Extensions","Calf Raises","Lunges"]
};

// Tabs
function showTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.add('hidden'));
    document.getElementById(tab).classList.remove('hidden');
}

// Populate exercises
const splitSelect = document.getElementById('splitSelect');
const exerciseSelect = document.getElementById('exerciseSelect');
function updateExercises() {
    const split = splitSelect.value;
    exerciseSelect.innerHTML = '';
    exercises[split].forEach(ex => {
        let option = document.createElement('option');
        option.textContent = ex;
        exerciseSelect.appendChild(option);
    });
}
splitSelect.addEventListener('change', updateExercises);
updateExercises();

// Workout Logging
const logForm = document.getElementById('logForm');
const workoutTable = document.querySelector('#workoutTable tbody');
let workouts = JSON.parse(localStorage.getItem('workouts') || '[]');

function renderWorkouts() {
    workoutTable.innerHTML = '';
    workouts.forEach(w => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${w.date}</td><td>${w.exercise}</td><td>${w.volume}</td><td>${w.oneRM}</td>`;
        workoutTable.appendChild(tr);
    });
    document.getElementById('totalVolume').textContent = workouts.reduce((a,b)=>a+b.volume,0) + " kg";
}
logForm.addEventListener('submit', e=>{
    e.preventDefault();
    const sets = Number(document.getElementById('sets').value);
    const reps = Number(document.getElementById('reps').value);
    const weight = Number(document.getElementById('weight').value);
    const exercise = exerciseSelect.value;
    const volume = sets*reps*weight;
    const oneRM = Math.round(weight*(1 + reps/30));
    workouts.unshift({date:new Date().toLocaleDateString(),exercise,volume,oneRM});
    localStorage.setItem('workouts',JSON.stringify(workouts));
    renderWorkouts();
    updateChart();
});

// Nutrition Calculator
const nutritionForm = document.getElementById('nutritionForm');
const resultsDiv = document.getElementById('nutritionResults');
nutritionForm.addEventListener('submit', e=>{
    e.preventDefault();
    const w = Number(document.getElementById('nutriWeight').value);
    const act = Number(document.getElementById('activity').value);
    const goal = document.getElementById('goalSelect').value;
    const tdee = (w*22)*(1.2 + act*0.15);
    const offsets = {"Rapid Cut":-700,"Aggressive Bulk":500,"Lean Bulk":250,"Recomposition":0};
    const target_cal = tdee + offsets[goal];
    const protein = w*2.2;
    const fats = w*0.9;
    const carbs = (target_cal - (protein*4 + fats*9))/4;
    resultsDiv.innerHTML = `<pre>Strategy: ${goal}\nCalories: ${Math.round(target_cal)} kcal\nProtein: ${Math.round(protein)}g\nCarbs: ${Math.round(carbs)}g\nFats: ${Math.round(fats)}g</pre>`;
});

// Chart.js Weekly Volume
const ctx = document.getElementById('weeklyChart').getContext('2d');
let weeklyChart = new Chart(ctx,{
    type:'line',
    data:{
        labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
        datasets:[{label:'Weekly Volume',data:[0,0,0,0,0,0,0],backgroundColor:'rgba(0,230,118,0.2)',borderColor:'#00E676',fill:true,tension:0.4}]
    },
    options:{scales:{y:{beginAtZero:true}}}
});

function updateChart(){
    const data = [0,0,0,0,0,0,0];
    workouts.slice(0,7).forEach((w,i)=>data[i]=w.volume);
    weeklyChart.data.datasets[0].data = data;
    weeklyChart.update();
}

// Initial Render
renderWorkouts();
updateChart();
