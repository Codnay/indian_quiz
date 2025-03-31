// ========= THREE.JS SETUP =========
let scene, camera, renderer;
let particles, geometry;
let particleColors = [0xff9a3c, 0x1a1a2e, 0xe6873a];
let rotationSpeed = 0.001;
let animationId;

// Initialize Three.js scene
function initThreeJS() {
    scene = new THREE.Scene();
    
    // Create perspective camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    // Create particle system
    createParticles();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Start animation
    animate();
}

// Create particle system
function createParticles() {
    const count = 2000;
    geometry = new THREE.BufferGeometry();
    
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    const color = new THREE.Color();
    
    for (let i = 0; i < count; i++) {
        // Position particles in a sphere
        const radius = Math.random() * 30;
        const phi = Math.acos(-1 + Math.random() * 2);
        const theta = Math.random() * Math.PI * 2;
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
        
        // Random colors from our palette
        color.setHex(particleColors[Math.floor(Math.random() * particleColors.length)]);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
        
        // Random sizes
        sizes[i] = Math.random() * 0.5;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

// Animation loop
function animate() {
    animationId = requestAnimationFrame(animate);
    
    particles.rotation.x += rotationSpeed;
    particles.rotation.y += rotationSpeed * 0.8;
    
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Adjust animation speed based on quiz progress
function updateAnimation(progress) {
    rotationSpeed = 0.001 + (progress / 20) * 0.005;
    
    // Add a burst effect when answering
    const positions = geometry.attributes.position.array;
    const count = positions.length / 3;
    
    for (let i = 0; i < count; i++) {
        const distance = Math.sqrt(
            positions[i * 3] ** 2 + 
            positions[i * 3 + 1] ** 2 + 
            positions[i * 3 + 2] ** 2
        );
        
        const factor = 1.05;
        positions[i * 3] *= factor;
        positions[i * 3 + 1] *= factor;
        positions[i * 3 + 2] *= factor;
        
        if (distance > 35) {
            const phi = Math.acos(-1 + Math.random() * 2);
            const theta = Math.random() * Math.PI * 2;
            const radius = Math.random() * 20;
            
            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);
        }
    }
    
    geometry.attributes.position.needsUpdate = true;
}

// ========= QUIZ FUNCTIONALITY =========
// Quiz questions
const questions = [
    {
        question: "What year did the First War of Indian Independence (also known as the Sepoy Mutiny) begin?",
        options: ["1847", "1857", "1867", "1877"],
        answer: 1
    },
    {
        question: "Who was the last Mughal Emperor of India?",
        options: ["Shah Alam II", "Akbar II", "Bahadur Shah Zafar", "Muhammad Shah"],
        answer: 2
    },
    {
        question: "Which organization was founded by Annie Besant and Bal Gangadhar Tilak in 1916?",
        options: ["Indian National Congress", "Home Rule League", "Azad Hind Fauj", "Khilafat Movement"],
        answer: 1
    },
    {
        question: "The Jallianwala Bagh Massacre took place in which year?",
        options: ["1915", "1917", "1919", "1921"],
        answer: 2
    },
    {
        question: "Who started the 'Quit India Movement' in 1942?",
        options: ["Jawaharlal Nehru", "Mahatma Gandhi", "Subhas Chandra Bose", "Sardar Vallabhbhai Patel"],
        answer: 1
    },
    {
        question: "Who was the first Governor-General of independent India?",
        options: ["Lord Mountbatten", "C. Rajagopalachari", "Jawaharlal Nehru", "Sardar Vallabhbhai Patel"],
        answer: 1
    },
    {
        question: "When was the Indian National Congress founded?",
        options: ["1875", "1885", "1895", "1905"],
        answer: 1
    },
    {
        question: "The partition of Bengal was announced by Lord Curzon in which year?",
        options: ["1901", "1903", "1905", "1907"],
        answer: 2
    },
    {
        question: "Who was the leader of the Indian National Army (Azad Hind Fauj)?",
        options: ["Bhagat Singh", "Chandrashekhar Azad", "Subhas Chandra Bose", "Lala Lajpat Rai"],
        answer: 2
    },
    {
        question: "When did India gain independence from British rule?",
        options: ["August 15, 1947", "January 26, 1950", "August 15, 1950", "January 26, 1947"],
        answer: 0
    },
    {
        question: "Who was India's first Prime Minister?",
        options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Sardar Vallabhbhai Patel", "B.R. Ambedkar"],
        answer: 1
    },
    {
        question: "The Dandi March (Salt March) was led by Mahatma Gandhi in which year?",
        options: ["1920", "1925", "1930", "1935"],
        answer: 2
    },
    {
        question: "When was the Constitution of India adopted?",
        options: ["August 15, 1947", "January 26, 1950", "November 26, 1949", "October 2, 1950"],
        answer: 2
    },
    {
        question: "Who is known as the 'Iron Man of India'?",
        options: ["Jawaharlal Nehru", "Mahatma Gandhi", "Sardar Vallabhbhai Patel", "Subhas Chandra Bose"],
        answer: 2
    },
    {
        question: "The Indian National Congress split into moderates and extremists at the Surat Session in which year?",
        options: ["1905", "1907", "1909", "1911"],
        answer: 1
    },
    {
        question: "Who composed the national anthem of India, 'Jana Gana Mana'?",
        options: ["Rabindranath Tagore", "Bankim Chandra Chatterjee", "Sarojini Naidu", "Muhammad Iqbal"],
        answer: 0
    },
    {
        question: "The Interim Government of India was formed in which year?",
        options: ["1942", "1944", "1946", "1947"],
        answer: 2
    },
    {
        question: "Which act introduced dyarchy in the provinces of British India?",
        options: ["Government of India Act 1919", "Government of India Act 1935", "Indian Councils Act 1909", "Indian Independence Act 1947"],
        answer: 0
    },
    {
        question: "The first Prime Minister of independent India to die in office was:",
        options: ["Jawaharlal Nehru", "Lal Bahadur Shastri", "Indira Gandhi", "Rajiv Gandhi"],
        answer: 0
    },
    {
        question: "The Emergency was declared by Prime Minister Indira Gandhi in which year?",
        options: ["1971", "1973", "1975", "1977"],
        answer: 2
    }
];

let currentQuestion = 0;
let score = 0;
let quizCompleted = false;
let selectedOption = null;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Three.js
    initThreeJS();
    
    // Set up event listeners
    document.getElementById('start-button').addEventListener('click', startQuiz);
    document.getElementById('next-button').addEventListener('click', nextQuestion);
    document.getElementById('restart-button').addEventListener('click', restartQuiz);
});

function startQuiz() {
    // Hide start screen and show question screen
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('question-screen').classList.remove('hidden');
    
    // Display first question
    displayQuestion();
    
    // Animate the quiz container appearing
    gsap.from('#quiz-container', { 
        duration: 1, 
        scale: 0.5, 
        opacity: 0, 
        ease: "back.out(1.7)" 
    });
}

function displayQuestion() {
    const questionData = questions[currentQuestion];
    
    // Update question number and progress bar
    document.getElementById('current-question').textContent = currentQuestion + 1;
    document.getElementById('progress').style.width = `${((currentQuestion) / questions.length) * 100}%`;
    
    // Set question text
    document.getElementById('question').textContent = questionData.question;
    
    // Create option elements
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    questionData.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.dataset.index = index;
        optionElement.addEventListener('click', selectOption);
        optionsContainer.appendChild(optionElement);
    });
    
    // Hide next button and reset selection
    document.getElementById('next-button').classList.add('hidden');
    selectedOption = null;
    
    // Add animation effect for question appearance
    gsap.from('#question', { duration: 0.5, x: -50, opacity: 0 });
    gsap.from('.option', { 
        duration: 0.5, 
        x: -30, 
        opacity: 0, 
        stagger: 0.1,
        ease: "power2.out"
    });
}

function selectOption(e) {
    // If an option is already selected, do nothing
    if (selectedOption !== null) return;
    
    selectedOption = parseInt(e.target.dataset.index);
    const correctAnswer = questions[currentQuestion].answer;
    
    // Disable all options
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.classList.add('disabled');
    });
    
    // Highlight correct and incorrect options
    if (selectedOption === correctAnswer) {
        e.target.classList.add('correct');
        score++;
        document.getElementById('score').textContent = score;
        
        // Create a particle burst effect
        gsap.to(particles.rotation, { 
            duration: 1, 
            x: particles.rotation.x + Math.PI / 4, 
            y: particles.rotation.y + Math.PI / 4,
            ease: "power2.out" 
        });
    } else {
        e.target.classList.add('incorrect');
        options[correctAnswer].classList.add('correct');
        
        // Shake the camera slightly for wrong answer
        gsap.to(camera.position, { 
            duration: 0.1, 
            x: 1, 
            yoyo: true, 
            repeat: 5,
            ease: "power1.inOut"
        });
    }
    
    // Update animation based on progress
    updateAnimation(currentQuestion + 1);
    
    // Show next button
    document.getElementById('next-button').classList.remove('hidden');
    gsap.from('#next-button', { duration: 0.5, y: 20, opacity: 0 });
}

function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion >= questions.length) {
        endQuiz();
    } else {
        displayQuestion();
    }
}

function endQuiz() {
    // Hide question screen and show result screen
    document.getElementById('question-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
    
    // Display final score
    document.getElementById('final-score').textContent = score;
    
    // Display result message based on score
    const resultMessage = document.getElementById('result-message');
    
    if (score >= 18) {
        resultMessage.textContent = "Outstanding! You're a true expert on Indian history!";
    } else if (score >= 15) {
        resultMessage.textContent = "Great job! You have excellent knowledge of Indian history!";
    } else if (score >= 10) {
        resultMessage.textContent = "Good effort! You know quite a bit about Indian history.";
    } else if (score >= 5) {
        resultMessage.textContent = "Not bad, but there's room for improvement.";
    } else {
        resultMessage.textContent = "You might want to study up on Indian history. Keep learning!";
    }
    
    // Create celebratory animation
    gsap.to(particles.rotation, { 
        duration: 2, 
        x: particles.rotation.x + Math.PI, 
        y: particles.rotation.y + Math.PI, 
        ease: "power2.inOut" 
    });
    
    // Animate result screen
    gsap.from('#result-screen', { 
        duration: 1, 
        opacity: 0, 
        y: 50, 
        ease: "back.out(1.2)" 
    });
    
    quizCompleted = true;
}

function restartQuiz() {
    // Reset quiz state
    currentQuestion = 0;
    score = 0;
    quizCompleted = false;
    selectedOption = null;
    
    // Update score display
    document.getElementById('score').textContent = 0;
    
    // Hide result screen and show question screen
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('question-screen').classList.remove('hidden');
    
    // Reset progress bar
    document.getElementById('progress').style.width = '0%';
    
    // Display first question
    displayQuestion();
} 