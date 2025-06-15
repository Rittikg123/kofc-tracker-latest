document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('catForm');
  const saveBtn = document.getElementById('saveBtn');
  const saveAddAnotherBtn = document.getElementById('saveAddBtn');
  const popup = document.getElementById('popupMessage');

  let stayOnPage = false;

  saveBtn.addEventListener('click', function (e) {
    e.preventDefault();
    stayOnPage = false;
    submitForm();
  });

  saveAddAnotherBtn.addEventListener('click', function (e) {
    e.preventDefault();
    stayOnPage = true;
    submitForm();
  });

  function showPopup(message) {
    popup.textContent = message;
    popup.classList.add('show-popup');
    popup.style.display = 'block';
    setTimeout(() => {
      popup.classList.remove('show-popup');
      setTimeout(() => {
        popup.style.display = 'none';
      }, 300); // Wait for animation to finish
    }, 5000);
  }

  async function submitForm() {
    try {
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      // Validate required fields
      const requiredFields = [
        'council', 'event_date', 'event_time', 'activity_name', 'category',
        'description', 'location_name', 'location_address',
        'location_city', 'location_zipcode', 'coordinator_name', 'coordinator_phone', 'coordinator_email'
      ];
      const missingFields = requiredFields.filter(field => !data[field]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      data.reporting_date = new Date().toISOString().slice(0, 10);
      const user = JSON.parse(localStorage.getItem("currentUser"));
      data.reporting_user = user?.first_name || "";

      const response = await fetch('http://localhost:5051/api/cat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.details || 'Failed to save data');
      }

      showPopup('Added cat event successfully!');

      if (stayOnPage) {
        // Only clear event_date and event_time, keep other fields
        form.querySelector('[name="event_date"]').value = '';
        form.querySelector('[name="event_time"]').value = '';
        // Optionally, focus the date field for convenience
        form.querySelector('[name="event_date"]').focus();
      } else {
        form.reset();
        setTimeout(() => {
          window.location.href = 'user-dashboard.html';
        }, 500); // Give a brief moment for popup to show
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert(err.message);
    }
  }
});