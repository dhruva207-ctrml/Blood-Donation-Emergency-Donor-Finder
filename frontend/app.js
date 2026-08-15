const donorForm = document.getElementById('donorForm');
const requestForm = document.getElementById('requestForm');
const donorList = document.getElementById('donorList');
const requestList = document.getElementById('requestList');
const requestDetails = document.getElementById('requestDetails');
const messageBox = document.getElementById('messageBox');

const donorSearch = document.getElementById('donorSearch');
const donorBloodFilter = document.getElementById('donorBloodFilter');
const donorLocationFilter = document.getElementById('donorLocationFilter');
const requestSearch = document.getElementById('requestSearch');

let donors = [];
let requests = [];
let selectedRequestId = null;

function showMessage(type, text) {
  messageBox.className = `message-box ${type}`;
  messageBox.textContent = text;
}

function clearMessage() {
  messageBox.className = 'message-box';
  messageBox.textContent = '';
}

function setFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorBox = document.getElementById(fieldId + 'Error');

  if (field) {
    field.classList.toggle('input-error', Boolean(message));
  }

  if (errorBox) {
    errorBox.textContent = message || '';
  }
}

function clearAllFieldErrors() {
  const errorFields = document.querySelectorAll('.field-error');
  errorFields.forEach(function (item) {
    item.textContent = '';
  });

  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(function (input) {
    input.classList.remove('input-error');
  });
}

function enforceNumericInput(inputId) {
  const input = document.getElementById(inputId);

  if (!input) return;

  input.addEventListener('input', function () {
    input.value = input.value.replace(/[^0-9]/g, '').slice(0, 10);
  });
}

function toggleDonationDateField() {
  const donationChoice = document.getElementById('donationChoice').value;
  const lastDonationGroup = document.getElementById('lastDonationDateGroup');

  if (donationChoice === 'never-donated') {
    lastDonationGroup.style.display = 'none';
    document.getElementById('lastDonationDate').value = '';
    setFieldError('lastDonationDate', '');
  } else {
    lastDonationGroup.style.display = 'block';
  }
}

function getStatusClass(status) {
  const statusValue = status || 'Pending';
  const lower = statusValue.toLowerCase();

  if (lower === 'available') return 'status-available';
  if (lower === 'busy') return 'status-busy';
  if (lower === 'unavailable') return 'status-unavailable';
  if (lower === 'matched') return 'status-matched';
  if (lower === 'completed') return 'status-completed';
  if (lower === 'cancelled') return 'status-cancelled';
  return 'status-pending';
}

function renderDonorCards() {
  const searchText = donorSearch.value.trim().toLowerCase();
  const bloodFilter = donorBloodFilter.value;
  const locationFilter = donorLocationFilter.value.trim().toLowerCase();

  const filteredDonors = donors.filter(function (donor) {
    const matchesName = donor.name.toLowerCase().includes(searchText);
    const matchesBlood = !bloodFilter || donor.bloodGroup === bloodFilter;
    const matchesLocation = !locationFilter || donor.location.toLowerCase().includes(locationFilter);

    return matchesName && matchesBlood && matchesLocation;
  });

  if (filteredDonors.length === 0) {
    donorList.innerHTML = '<p class="empty-state">No donors found.</p>';
    return;
  }

  donorList.innerHTML = filteredDonors.map(function (donor) {
    return `
      <div class="donor-card">
        <h3>${donor.name}</h3>
        <p class="meta"><strong>Blood:</strong> ${donor.bloodGroup}</p>
        <p class="meta"><strong>Location:</strong> ${donor.location}</p>
        <p class="meta"><strong>Contact:</strong> ${donor.contact}</p>
        <p class="meta"><strong>Last Donation:</strong> ${donor.lastDonationDate}</p>
        <span class="status-badge ${getStatusClass(donor.availability)}">${donor.availability}</span>
        <p class="meta">${donor.notes || 'No notes added.'}</p>
        <div class="card-actions">
          <button class="small-btn edit-btn" data-action="edit-donor" data-id="${donor.id}">Edit</button>
          <button class="small-btn delete-btn" data-action="delete-donor" data-id="${donor.id}">Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

function renderRequestCards() {
  const searchText = requestSearch.value.trim().toLowerCase();

  const filteredRequests = requests.filter(function (request) {
    const searchValue = `${request.patientName} ${request.requiredBloodGroup} ${request.location} ${request.hospitalName}`.toLowerCase();
    return searchValue.includes(searchText);
  });

  if (filteredRequests.length === 0) {
    requestList.innerHTML = '<p class="empty-state">No requests found.</p>';
    return;
  }

  requestList.innerHTML = filteredRequests.map(function (request) {
    const activeClass = request.id === selectedRequestId ? 'active' : '';
    return `
      <div class="request-item ${activeClass}" data-id="${request.id}">
        <h3>${request.patientName}</h3>
        <p class="meta"><strong>Blood:</strong> ${request.requiredBloodGroup}</p>
        <p class="meta"><strong>Hospital:</strong> ${request.hospitalName}</p>
        <p class="meta"><strong>Location:</strong> ${request.location}</p>
        <span class="status-badge ${getStatusClass(request.status)}">${request.status}</span>
        <div class="card-actions">
          <button class="small-btn edit-btn" data-action="edit-request" data-id="${request.id}">Edit</button>
          <button class="small-btn delete-btn" data-action="delete-request" data-id="${request.id}">Delete</button>
        </div>
      </div>
    `;
  }).join('');

  requestList.querySelectorAll('.request-item').forEach(function (card) {
    card.addEventListener('click', function (event) {
      if (event.target.tagName === 'BUTTON') {
        return;
      }
      const id = Number(card.dataset.id);
      selectedRequestId = id;
      renderRequestDetails();
      renderRequestCards();
    });
  });
}

function renderRequestDetails() {
  const request = requests.find(function (item) {
    return item.id === selectedRequestId;
  });

  if (!request) {
    requestDetails.innerHTML = '<p class="empty-state">Select a request to view details.</p>';
    return;
  }

  requestDetails.innerHTML = `
    <div class="details-box">
      <p><strong>Patient:</strong> ${request.patientName}</p>
      <p><strong>Required Blood:</strong> ${request.requiredBloodGroup}</p>
      <p><strong>Quantity:</strong> ${request.quantity}</p>
      <p><strong>Hospital:</strong> ${request.hospitalName}</p>
      <p><strong>Location:</strong> ${request.location}</p>
      <p><strong>Required Date:</strong> ${request.requiredDateTime}</p>
      <p><strong>Description:</strong> ${request.description}</p>
      <p><strong>Contact:</strong> ${request.contact}</p>
      <p><strong>Status:</strong> <span class="status-badge ${getStatusClass(request.status)}">${request.status}</span></p>
    </div>
  `;
}

function resetDonorForm() {
  donorForm.reset();
  donorForm.dataset.editId = '';
  clearAllFieldErrors();
  document.getElementById('donationChoice').value = 'has-donated';
  toggleDonationDateField();
  const submitButton = donorForm.querySelector('button[type="submit"]');
  submitButton.textContent = 'Save Donor';
}

function resetRequestForm() {
  requestForm.reset();
  requestForm.dataset.editId = '';
  clearAllFieldErrors();
  const submitButton = requestForm.querySelector('button[type="submit"]');
  submitButton.textContent = 'Create Request';
}

function validateDonorForm(data) {
  clearAllFieldErrors();
  let isValid = true;

  if (!data.name) {
    setFieldError('donorName', 'Name is required.');
    isValid = false;
  } else if (!/^[A-Za-z\s]+$/.test(data.name.trim())) {
    setFieldError('donorName', 'Name should contain only letters and spaces.');
    isValid = false;
  }

  if (!data.bloodGroup) {
    setFieldError('donorBloodGroup', 'Please select a blood group.');
    isValid = false;
  } else if (!['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].includes(data.bloodGroup)) {
    setFieldError('donorBloodGroup', 'Invalid blood group selected.');
    isValid = false;
  }

  if (!data.contact) {
    setFieldError('donorContact', 'Contact is required.');
    isValid = false;
  } else if (!/^[0-9]{10}$/.test(data.contact)) {
    setFieldError('donorContact', 'Contact number should be exactly 10 digits.');
    isValid = false;
  }

  if (!data.location) {
    setFieldError('donorLocation', 'Location is required.');
    isValid = false;
  }

  if (!data.availability) {
    setFieldError('donorAvailability', 'Please select availability.');
    isValid = false;
  }

  if (data.donationChoice === 'has-donated' && !data.lastDonationDate) {
    setFieldError('lastDonationDate', 'Please enter the last donation date.');
    isValid = false;
  }

  return isValid ? '' : 'Please fix the highlighted donor fields.';
}

function validateRequestForm(data) {
  clearAllFieldErrors();
  let isValid = true;

  if (!data.requiredBloodGroup) {
    setFieldError('requiredBloodGroup', 'Blood group is required.');
    isValid = false;
  } else if (!['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].includes(data.requiredBloodGroup)) {
    setFieldError('requiredBloodGroup', 'Invalid blood group.');
    isValid = false;
  }

  if (!data.quantity) {
    setFieldError('requestQuantity', 'Quantity is required.');
    isValid = false;
  } else if (Number(data.quantity) <= 0 || !Number.isInteger(Number(data.quantity))) {
    setFieldError('requestQuantity', 'Quantity must be a positive whole number.');
    isValid = false;
  }

  if (!data.patientName) {
    setFieldError('patientName', 'Patient name is required.');
    isValid = false;
  }

  if (!data.hospitalName) {
    setFieldError('hospitalName', 'Hospital name is required.');
    isValid = false;
  }

  if (!data.location) {
    setFieldError('requestLocation', 'Location is required.');
    isValid = false;
  }

  if (!data.requiredDateTime) {
    setFieldError('requiredDateTime', 'Required date and time are required.');
    isValid = false;
  }

  if (!data.description) {
    setFieldError('requestDescription', 'Description is required.');
    isValid = false;
  }

  if (!data.contact) {
    setFieldError('requestContact', 'Contact is required.');
    isValid = false;
  } else if (!/^[0-9]{10}$/.test(data.contact)) {
    setFieldError('requestContact', 'Contact number should be exactly 10 digits.');
    isValid = false;
  }

  return isValid ? '' : 'Please fix the highlighted request fields.';
}

function loadDonors() {
  donors = [];
  renderDonorCards();
}

function loadRequests() {
  requests = [];
  selectedRequestId = null;
  renderRequestCards();
  renderRequestDetails();
}

function addDonor(event) {
  event.preventDefault();
  const donationChoice = document.getElementById('donationChoice').value;
  const donorData = {
    name: document.getElementById('donorName').value,
    bloodGroup: document.getElementById('donorBloodGroup').value,
    contact: document.getElementById('donorContact').value,
    location: document.getElementById('donorLocation').value,
    availability: document.getElementById('donorAvailability').value,
    lastDonationDate: donationChoice === 'never-donated' ? '' : document.getElementById('lastDonationDate').value,
    notes: document.getElementById('donorNotes').value,
    donationChoice: donationChoice
  };

  const error = validateDonorForm(donorData);
  if (error) {
    showMessage('error', error);
    return;
  }

  const editId = donorForm.dataset.editId;

  if (editId) {
    const donor = donors.find(function (item) {
      return item.id === Number(editId);
    });

    if (donor) {
      donor.name = donorData.name.trim();
      donor.bloodGroup = donorData.bloodGroup;
      donor.contact = donorData.contact.trim();
      donor.location = donorData.location.trim();
      donor.availability = donorData.availability;
      donor.lastDonationDate = donorData.lastDonationDate;
      donor.notes = donorData.notes.trim();
      showMessage('success', 'Donor updated successfully.');
    }
  } else {
    const newId = donors.length ? donors[donors.length - 1].id + 1 : 1;
    const lastDonationValue = donorData.lastDonationDate || 'Never donated';
    const donorNotes = donorData.notes ? donorData.notes.trim() : 'First-time donor.';

    donors.push({
      id: newId,
      name: donorData.name.trim(),
      bloodGroup: donorData.bloodGroup,
      contact: donorData.contact.trim(),
      location: donorData.location.trim(),
      availability: donorData.availability,
      lastDonationDate: lastDonationValue,
      notes: donorNotes
    });

    showMessage('success', 'Donor submitted successfully.');
  }

  resetDonorForm();
  renderDonorCards();
}

function addRequest(event) {
  event.preventDefault();
  const requestData = {
    requiredBloodGroup: document.getElementById('requiredBloodGroup').value,
    quantity: document.getElementById('requestQuantity').value,
    patientName: document.getElementById('patientName').value,
    hospitalName: document.getElementById('hospitalName').value,
    location: document.getElementById('requestLocation').value,
    requiredDateTime: document.getElementById('requiredDateTime').value,
    description: document.getElementById('requestDescription').value,
    contact: document.getElementById('requestContact').value,
    status: 'Pending'
  };

  const error = validateRequestForm(requestData);
  if (error) {
    showMessage('error', error);
    return;
  }

  const editId = requestForm.dataset.editId;

  if (editId) {
    const request = requests.find(function (item) {
      return item.id === Number(editId);
    });

    if (request) {
      request.requiredBloodGroup = requestData.requiredBloodGroup;
      request.quantity = Number(requestData.quantity);
      request.patientName = requestData.patientName.trim();
      request.hospitalName = requestData.hospitalName.trim();
      request.location = requestData.location.trim();
      request.requiredDateTime = requestData.requiredDateTime;
      request.description = requestData.description.trim();
      request.contact = requestData.contact.trim();
      showMessage('success', 'Request updated successfully.');
    }
  } else {
    const newId = requests.length ? requests[requests.length - 1].id + 1 : 1;
    requests.push({ id: newId, ...requestData, patientName: requestData.patientName.trim(), description: requestData.description.trim() });
    selectedRequestId = newId;
    showMessage('success', 'Emergency request submitted successfully.');
  }

  resetRequestForm();
  renderRequestCards();
  renderRequestDetails();
}

function handleListAction(event) {
  const action = event.target.dataset.action;
  const id = Number(event.target.dataset.id);

  if (!action || !id) {
    return;
  }

  if (action === 'delete-donor') {
    donors = donors.filter(function (donor) {
      return donor.id !== id;
    });
    renderDonorCards();
    showMessage('success', 'Donor deleted successfully.');
    return;
  }

  if (action === 'edit-donor') {
    const donor = donors.find(function (item) {
      return item.id === id;
    });

    if (!donor) return;

    document.getElementById('donorName').value = donor.name;
    document.getElementById('donorBloodGroup').value = donor.bloodGroup;
    document.getElementById('donorContact').value = donor.contact;
    document.getElementById('donorLocation').value = donor.location;
    document.getElementById('donorAvailability').value = donor.availability;
    document.getElementById('lastDonationDate').value = donor.lastDonationDate;
    document.getElementById('donorNotes').value = donor.notes;

    donorForm.dataset.editId = String(id);
    donorForm.querySelector('button[type="submit"]').textContent = 'Update Donor';
    showMessage('success', 'Donor details loaded for editing.');
    return;
  }

  if (action === 'delete-request') {
    requests = requests.filter(function (request) {
      return request.id !== id;
    });

    if (selectedRequestId === id) {
      selectedRequestId = requests.length ? requests[0].id : null;
    }

    renderRequestCards();
    renderRequestDetails();
    showMessage('success', 'Request deleted successfully.');
    return;
  }

  if (action === 'edit-request') {
    const request = requests.find(function (item) {
      return item.id === id;
    });

    if (!request) return;

    document.getElementById('requiredBloodGroup').value = request.requiredBloodGroup;
    document.getElementById('requestQuantity').value = request.quantity;
    document.getElementById('patientName').value = request.patientName;
    document.getElementById('hospitalName').value = request.hospitalName;
    document.getElementById('requestLocation').value = request.location;
    document.getElementById('requiredDateTime').value = request.requiredDateTime;
    document.getElementById('requestDescription').value = request.description;
    document.getElementById('requestContact').value = request.contact;

    requestForm.dataset.editId = String(id);
    requestForm.querySelector('button[type="submit"]').textContent = 'Update Request';
    showMessage('success', 'Request loaded for editing.');
  }
}

document.getElementById('donationChoice').addEventListener('change', toggleDonationDateField);
enforceNumericInput('donorContact');
enforceNumericInput('requestContact');
donorForm.addEventListener('submit', addDonor);
requestForm.addEventListener('submit', addRequest);
donorList.addEventListener('click', handleListAction);
requestList.addEventListener('click', handleListAction);

donorSearch.addEventListener('input', renderDonorCards);
donorBloodFilter.addEventListener('change', renderDonorCards);
donorLocationFilter.addEventListener('input', renderDonorCards);
requestSearch.addEventListener('input', renderRequestCards);

document.getElementById('resetDonorBtn').addEventListener('click', resetDonorForm);
document.getElementById('resetRequestBtn').addEventListener('click', resetRequestForm);

toggleDonationDateField();
loadDonors();
loadRequests();
