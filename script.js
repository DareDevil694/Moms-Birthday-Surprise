let clickCount = 0; // Tracks clicks for the two pop-ups

// Photo Slider Variables
const TOTAL_PHOTOS = 16;
let currentPhotoIndex = 1; 
let photoDisplayArea = null; 
let captionElement = null; 
let grandFinalePopup = null; 
let finaleShown = false; // NEW: prevents multiple triggers

// Initialize Photos Array
const photoSources = [];
for (let i = 1; i <= TOTAL_PHOTOS; i++) {
    photoSources.push({
        src: `mom_photo_${i}.jpg`,
        id: `photo-${i}`,
        alt: `Mom Photo ${i}`
    });
}

// Load Photos
function loadPhotos() {
    if (!photoDisplayArea) {
        photoDisplayArea = document.getElementById("photo-display-area");
        captionElement = document.getElementById("photo-caption");
        grandFinalePopup = document.getElementById("grand-finale-popup");
    }

    let html = '';
    photoSources.forEach(photo => {
        const activeClass = photo.id === 'photo-1' ? 'active' : '';
        html += `
            <div id="${photo.id}" class="polaroid-frame ${activeClass}">
                <img src="${photo.src}" alt="${photo.alt}">
                <img src="clothespin.png" alt="Clothespin" class="clothespin">
            </div>
        `;
    });
    photoDisplayArea.innerHTML = html;
}

// Surprise Pop-up Handler
function showSurprise() {
    const music = document.getElementById("bday-music");
    if (music) {
        music.play().catch(error => {
            console.log("Music play blocked by browser policy.", error);
        });
    }

    clickCount++;
    const firstPopup = document.getElementById("popup");
    const secondPopup = document.getElementById("second-popup");
    const button = document.querySelector(".btn");

    if (clickCount === 1) {
        firstPopup.classList.remove("hidden");
        button.textContent = "See the Main Gift! (Click Again)";
    } else if (clickCount === 2) {
        firstPopup.classList.add("hidden");
        secondPopup.classList.remove("hidden");
        button.textContent = "Happy Birthday!";
        
        loadPhotos();
        currentPhotoIndex = 1; 
        updatePhoto(1); 
    }
}

// Show Grand Finale
function showGrandFinale() {
    if (finaleShown) return; // prevent multiple triggers
    finaleShown = true;

    document.getElementById("second-popup").classList.add('hidden');
    grandFinalePopup.classList.add('active');

    const message = "You have been invited to the Grand Finale";
    const typewriterElement = document.getElementById('typewriter-text');
    const finalDetailsElement = document.getElementById('final-details');
    let i = 0;

    document.getElementById("bday-music").pause();

    function type() {
        if (i < message.length) {
            typewriterElement.textContent += message.charAt(i);
            i++;
            setTimeout(type, 75);
        } else {
            typewriterElement.style.borderRight = 'none';
            finalDetailsElement.classList.remove('hidden');
            setTimeout(() => {
                document.getElementById("bday-music").play();
            }, 1000); 
        }
    }

    typewriterElement.textContent = '';
    typewriterElement.style.borderRight = '3px solid white';
    type();
}

// Change Photo
function changePhoto(n) {
    let newIndex = currentPhotoIndex + n;

    // Trigger finale when NEXT is clicked on last photo
    if (n === 1 && currentPhotoIndex === TOTAL_PHOTOS) {
        showGrandFinale();
        return; 
    }

    if (newIndex > TOTAL_PHOTOS) newIndex = 1; 
    if (newIndex < 1) newIndex = TOTAL_PHOTOS; 
    
    updatePhoto(newIndex);
}

// Update Photo
function updatePhoto(newIndex) {
    if (!captionElement) {
        captionElement = document.getElementById("photo-caption");
    }
    
    const currentActive = document.querySelector('.polaroid-frame.active');
    if (currentActive) currentActive.classList.remove('active');
    
    const newActive = document.getElementById(`photo-${newIndex}`);
    if (newActive) newActive.classList.add('active');
    
    currentPhotoIndex = newIndex;
    captionElement.textContent = `Photo ${currentPhotoIndex} of ${TOTAL_PHOTOS}`;
}

// Confetti Generator
const canvas = document.getElementById("confetti-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const pieces = [];
const numPieces = 150;

for (let i = 0; i < numPieces; i++) {
    pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 10 + 5,
        c: `hsl(${Math.random() * 360}, 100%, 50%)`,
        s: Math.random() * 5 + 2
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let p of pieces) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.fill();

        p.y += p.s;
        if (p.y > canvas.height) p.y = -10;
    }

    requestAnimationFrame(update);
}

update();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
