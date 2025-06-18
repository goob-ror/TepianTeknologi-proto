const carouselImages = document.querySelector('.carousel-images');
const carouselDotsContainer = document.querySelector('.carousel-dots');
let currentIndex = 0;

// Create dots based on number of images
function createDots() {
  const imageCount = carouselImages.children.length;
  carouselDotsContainer.innerHTML = ''; // Clear existing dots
  
  for (let i = 0; i < imageCount; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot';
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      currentIndex = i;
      showImage(currentIndex);
    });
    carouselDotsContainer.appendChild(dot);
  }
}

function showImage(index) {
  const imageWidth = carouselImages.children[0].clientWidth;
  carouselImages.style.transform = `translateX(${-index * imageWidth}px)`;

  // Update active dot
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, i) => {
    if (i === index) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

function nextImage() {
  currentIndex = (currentIndex + 1) % carouselImages.children.length;
  showImage(currentIndex);
}

// Initialize dots and show first image
createDots();
showImage(currentIndex);

// Auto advance every 20 seconds
setInterval(nextImage, 20000); 