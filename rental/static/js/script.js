document.addEventListener("DOMContentLoaded", () => {
  // Update price slider value display
  const priceSlider = document.querySelector(".price-slider");
  const priceValues = document.querySelector(".price-values");

  if (priceSlider && priceValues) {
    const minValSpan = priceValues.children[0];
    const maxValSpan = priceValues.children[1];

    priceSlider.addEventListener("input", (e) => {
      // Simulate dynamic range updates
      maxValSpan.textContent = `₹${parseInt(e.target.value).toLocaleString()}`;
    });
  }

  // Add click ripple effect to buttons
  const buttons = document.querySelectorAll(".book-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      // Simple scaling animation
      this.style.transform = "scale(0.95)";
      this.style.backgroundColor = "var(--dark-green)";

      setTimeout(() => {
        this.style.transform = 'scale(1)';
        this.style.backgroundColor = 'var(--primary-green)';
      }, 150);

      // Route to equipment_details.html with rudimentary query params
      const tractorName = this.closest('.equipment-card').querySelector('.card-title').innerText.toLowerCase();
      let eqParam = 'tractor'; // Default
      if (tractorName.includes('harvester')) eqParam = 'harvester';
      if (tractorName.includes('tiller') || tractorName.includes('rotavator')) eqParam = 'tiller';
      if (tractorName.includes('new holland')) eqParam = 'new_holland';
      if (tractorName.includes('seed')) eqParam = 'seeder';
      if (tractorName.includes('spray')) eqParam = 'sprayer';
      
      setTimeout(() => {
        window.location.href = `equipment_details.html?eq=${eqParam}`;
      }, 200);
    });
  });

  // Toggles for filter sections (simulate accordion)
  const filterHeadings = document.querySelectorAll(".filter-heading");
  filterHeadings.forEach((heading) => {
    heading.addEventListener("click", () => {
      const icon = heading.querySelector("i");
      if (icon && icon.classList.contains("fa-chevron-up")) {
        icon.classList.replace("fa-chevron-up", "fa-chevron-down");
        // Hide next element sibling
        const nextEl = heading.nextElementSibling;
        if (nextEl) nextEl.style.display = "none";
      } else if (icon && icon.classList.contains("fa-chevron-down")) {
        icon.classList.replace("fa-chevron-down", "fa-chevron-up");
        // Show next element sibling
        const nextEl = heading.nextElementSibling;
        if (nextEl) nextEl.style.display = "block"; // or flex depending on the element, but simplistic for now
        if (nextEl && nextEl.classList.contains("checkbox-group"))
          nextEl.style.display = "flex";
        if (nextEl && nextEl.classList.contains("price-values")) {
          nextEl.style.display = "flex";
          nextEl.nextElementSibling.style.display = "block"; // slider
          nextEl.nextElementSibling.nextElementSibling.style.display = "flex"; // subtext
        }
      }
    });
  });

  // Category Filtering
  const categoryItems = document.querySelectorAll(".category-item");
  categoryItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Basic reset of other categories
      categoryItems.forEach(c => c.style.opacity = '0.7');
      item.style.opacity = '1';
      
      const categoryText = item.querySelector(".category-name").innerText.split("\n")[0].toLowerCase();
      
      const cards = document.querySelectorAll(".equipment-card");
      cards.forEach((card) => {
        const title = card.querySelector(".card-title").innerText.toLowerCase();
        
        // Show if category is in title, or if checking 'tractors' we default show some 
        if (title.includes(categoryText) || categoryText === 'tractors') {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
      });
    });
  });

  // Text Search Filtering
  const searchInput = document.querySelector(".search-input-wrapper input");
  if (searchInput) {
    searchInput.addEventListener("keyup", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const cards = document.querySelectorAll(".equipment-card");
      
      cards.forEach((card) => {
        const title = card.querySelector(".card-title").innerText.toLowerCase();
        const specs = card.querySelector(".card-specs").innerText.toLowerCase();
        
        if (title.includes(searchTerm) || specs.includes(searchTerm)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  }
});
