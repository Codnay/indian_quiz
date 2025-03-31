// Add shuffle function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startQuiz() {
    // Shuffle questions before starting
    shuffleArray(questions);
    
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
    
    // Shuffle options for more randomness (optional)
    const shuffledOptions = [...questionData.options];
    const correctAnswerValue = questionData.options[questionData.answer];
    
    // Shuffle the options
    shuffleArray(shuffledOptions);
    
    // Find the new index of the correct answer after shuffling
    const newCorrectIndex = shuffledOptions.indexOf(correctAnswerValue);
    questionData.currentAnswerIndex = newCorrectIndex;
    
    shuffledOptions.forEach((option, index) => {
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
    const correctAnswer = questions[currentQuestion].currentAnswerIndex;
    
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