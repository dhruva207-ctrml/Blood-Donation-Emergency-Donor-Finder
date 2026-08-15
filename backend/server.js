const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const validStatus = ['Pending', 'Matched', 'Completed', 'Cancelled'];
const validAvailability = ['Available', 'Busy', 'Unavailable'];

let donors = [
  {
    id: 1,
    name: 'Asha Verma',
    bloodGroup: 'O+',
    contact: '9876543210',
    location: 'Bangalore',
    availability: 'Available',
    lastDonationDate: '2024-06-15',
    notes: 'Available for urgent emergency blood donations.'
  },
  {
    id: 2,
    name: 'Rohit Kumar',
    bloodGroup: 'A+',
    contact: '9123456780',
    location: 'Hyderabad',
    availability: 'Busy',
    lastDonationDate: '2024-04-10',
    notes: 'Can donate next week.'
  },
  {
    id: 3,
    name: 'Nisha Patel',
    bloodGroup: 'AB-',
    contact: '9988776655',
    location: 'Pune',
    availability: 'Available',
    lastDonationDate: '2023-12-25',
    notes: 'Strong donor for rare blood type.'
  }
];

let requests = [
  {
    id: 1,
    requiredBloodGroup: 'O+',
    quantity: 2,
    patientName: 'Raju',
    hospitalName: 'City Care Hospital',
    location: 'Bangalore',
    requiredDateTime: '2026-08-16T14:00',
    description: 'Need blood for surgery in the evening.',
    contact: '8899001122',
    status: 'Pending'
  },
  {
    id: 2,
    requiredBloodGroup: 'AB-',
    quantity: 1,
    patientName: 'Meera',
    hospitalName: 'Green Valley Hospital',
    location: 'Pune',
    requiredDateTime: '2026-08-18T10:30',
    description: 'Urgent need for rare blood type.',
    contact: '7766554433',
    status: 'Matched'
  }
];

let nextDonorId = 4;
let nextRequestId = 3;

function isValidBloodGroup(value) {
  return validBloodGroups.includes(value);
}

function isValidStatus(value) {
  return validStatus.includes(value);
}

function isValidAvailability(value) {
  return validAvailability.includes(value);
}

function findDonor(id) {
  return donors.find(function (donor) {
    return donor.id === Number(id);
  });
}

function findRequest(id) {
  return requests.find(function (request) {
    return request.id === Number(id);
  });
}

app.get('/', function (request, response) {
  response.send('Blood Donation and Emergency Donor Finder API is running.');
});

app.get('/donors', function (request, response) {
  response.status(200).json({
    message: 'Donors fetched successfully.',
    donors: donors
  });
});

app.post('/donors', function (request, response) {
  const { name, bloodGroup, contact, location, availability, lastDonationDate, notes } = request.body;

  if (!name || !bloodGroup || !contact || !location || !availability) {
    return response.status(400).json({
      message: 'Please provide name, bloodGroup, contact, location, and availability.'
    });
  }

  if (!isValidBloodGroup(bloodGroup)) {
    return response.status(400).json({
      message: 'Blood group must be one of A+, A-, B+, B-, O+, O-, AB+, AB-.'
    });
  }

  if (!/^[0-9]{10}$/.test(String(contact))) {
    return response.status(400).json({
      message: 'Contact number must be 10 digits only.'
    });
  }

  if (!isValidAvailability(availability)) {
    return response.status(400).json({
      message: 'Availability must be Available, Busy, or Unavailable.'
    });
  }

  const newDonor = {
    id: nextDonorId,
    name: name.trim(),
    bloodGroup: bloodGroup.trim(),
    contact: contact.trim(),
    location: location.trim(),
    availability: availability.trim(),
    lastDonationDate: lastDonationDate ? lastDonationDate.trim() : 'Never donated',
    notes: notes ? notes.trim() : 'First-time donor.'
  };

  donors.push(newDonor);
  nextDonorId += 1;

  response.status(201).json({
    message: 'Donor added successfully.',
    donor: newDonor
  });
});

app.get('/donors/:id', function (request, response) {
  const donor = findDonor(request.params.id);

  if (!donor) {
    return response.status(404).json({
      message: 'Donor not found.'
    });
  }

  response.status(200).json({
    message: 'Donor fetched successfully.',
    donor: donor
  });
});

app.put('/donors/:id', function (request, response) {
  const donor = findDonor(request.params.id);

  if (!donor) {
    return response.status(404).json({
      message: 'Donor not found.'
    });
  }

  const { name, bloodGroup, contact, location, availability, lastDonationDate, notes } = request.body;

  if (!name || !bloodGroup || !contact || !location || !availability) {
    return response.status(400).json({
      message: 'Please provide name, bloodGroup, contact, location, and availability.'
    });
  }

  if (!isValidBloodGroup(bloodGroup)) {
    return response.status(400).json({
      message: 'Blood group must be one of A+, A-, B+, B-, O+, O-, AB+, AB-.'
    });
  }

  if (!/^[0-9]{10}$/.test(String(contact))) {
    return response.status(400).json({
      message: 'Contact number must be 10 digits only.'
    });
  }

  if (!isValidAvailability(availability)) {
    return response.status(400).json({
      message: 'Availability must be Available, Busy, or Unavailable.'
    });
  }

  donor.name = name.trim();
  donor.bloodGroup = bloodGroup.trim();
  donor.contact = contact.trim();
  donor.location = location.trim();
  donor.availability = availability.trim();
  donor.lastDonationDate = lastDonationDate ? lastDonationDate.trim() : 'Never donated';
  donor.notes = notes ? notes.trim() : 'First-time donor.';

  response.status(200).json({
    message: 'Donor updated successfully.',
    donor: donor
  });
});

app.delete('/donors/:id', function (request, response) {
  const donorId = Number(request.params.id);
  const donorIndex = donors.findIndex(function (donor) {
    return donor.id === donorId;
  });

  if (donorIndex === -1) {
    return response.status(404).json({
      message: 'Donor not found.'
    });
  }

  const deletedDonor = donors.splice(donorIndex, 1)[0];

  response.status(200).json({
    message: 'Donor deleted successfully.',
    donor: deletedDonor
  });
});

app.get('/requests', function (request, response) {
  response.status(200).json({
    message: 'Requests fetched successfully.',
    requests: requests
  });
});

app.post('/requests', function (request, response) {
  const {
    requiredBloodGroup,
    quantity,
    patientName,
    hospitalName,
    location,
    requiredDateTime,
    description,
    contact,
    status
  } = request.body;

  if (!requiredBloodGroup || !quantity || !patientName || !hospitalName || !location || !requiredDateTime || !description || !contact) {
    return response.status(400).json({
      message: 'Please provide all required request fields.'
    });
  }

  if (!isValidBloodGroup(requiredBloodGroup)) {
    return response.status(400).json({
      message: 'Required blood group must be one of A+, A-, B+, B-, O+, O-, AB+, AB-.'
    });
  }

  if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
    return response.status(400).json({
      message: 'Quantity must be a positive whole number.'
    });
  }

  if (!/^[0-9]{10}$/.test(String(contact))) {
    return response.status(400).json({
      message: 'Contact number must be 10 digits only.'
    });
  }

  const finalStatus = status && isValidStatus(status) ? status : 'Pending';

  const newRequest = {
    id: nextRequestId,
    requiredBloodGroup: requiredBloodGroup.trim(),
    quantity: Number(quantity),
    patientName: patientName.trim(),
    hospitalName: hospitalName.trim(),
    location: location.trim(),
    requiredDateTime: requiredDateTime.trim(),
    description: description.trim(),
    contact: contact.trim(),
    status: finalStatus
  };

  requests.push(newRequest);
  nextRequestId += 1;

  response.status(201).json({
    message: 'Emergency request created successfully.',
    request: newRequest
  });
});

app.get('/requests/:id', function (request, response) {
  const requestItem = findRequest(request.params.id);

  if (!requestItem) {
    return response.status(404).json({
      message: 'Request not found.'
    });
  }

  response.status(200).json({
    message: 'Request fetched successfully.',
    request: requestItem
  });
});

app.put('/requests/:id', function (request, response) {
  const requestItem = findRequest(request.params.id);

  if (!requestItem) {
    return response.status(404).json({
      message: 'Request not found.'
    });
  }

  const {
    requiredBloodGroup,
    quantity,
    patientName,
    hospitalName,
    location,
    requiredDateTime,
    description,
    contact,
    status
  } = request.body;

  if (!requiredBloodGroup || !quantity || !patientName || !hospitalName || !location || !requiredDateTime || !description || !contact) {
    return response.status(400).json({
      message: 'Please provide all required request fields.'
    });
  }

  if (!isValidBloodGroup(requiredBloodGroup)) {
    return response.status(400).json({
      message: 'Required blood group must be one of A+, A-, B+, B-, O+, O-, AB+, AB-.'
    });
  }

  if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
    return response.status(400).json({
      message: 'Quantity must be a positive whole number.'
    });
  }

  if (!/^[0-9]{10}$/.test(String(contact))) {
    return response.status(400).json({
      message: 'Contact number must be 10 digits only.'
    });
  }

  if (status && !isValidStatus(status)) {
    return response.status(400).json({
      message: 'Status must be one of Pending, Matched, Completed, Cancelled.'
    });
  }

  requestItem.requiredBloodGroup = requiredBloodGroup.trim();
  requestItem.quantity = Number(quantity);
  requestItem.patientName = patientName.trim();
  requestItem.hospitalName = hospitalName.trim();
  requestItem.location = location.trim();
  requestItem.requiredDateTime = requiredDateTime.trim();
  requestItem.description = description.trim();
  requestItem.contact = contact.trim();

  if (status) {
    requestItem.status = status.trim();
  }

  response.status(200).json({
    message: 'Request updated successfully.',
    request: requestItem
  });
});

app.delete('/requests/:id', function (request, response) {
  const requestId = Number(request.params.id);
  const requestIndex = requests.findIndex(function (item) {
    return item.id === requestId;
  });

  if (requestIndex === -1) {
    return response.status(404).json({
      message: 'Request not found.'
    });
  }

  const deletedRequest = requests.splice(requestIndex, 1)[0];

  response.status(200).json({
    message: 'Request deleted successfully.',
    request: deletedRequest
  });
});

app.listen(PORT, function () {
  console.log(`Blood donation API is running on http://localhost:${PORT}`);
});
