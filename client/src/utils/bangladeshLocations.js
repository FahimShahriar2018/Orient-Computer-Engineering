export const BANGLADESH_DIVISIONS = [
  {
    name: 'Dhaka',
    districts: [
      'Dhaka',
      'Gazipur',
      'Narayanganj',
      'Tangail',
      'Narsingdi',
      'Manikganj',
      'Munshiganj',
      'Faridpur',
      'Gopalganj',
      'Madaripur',
      'Rajbari',
      'Shariatpur',
      'Kishoreganj',
    ],
  },
  {
    name: 'Chittagong',
    districts: [
      'Chittagong',
      'Cox\'s Bazar',
      'Comilla',
      'Feni',
      'Brahmanbaria',
      'Noakhali',
      'Chandpur',
      'Lakshmipur',
      'Rangamati',
      'Khagrachhari',
      'Bandarban',
    ],
  },
  {
    name: 'Sylhet',
    districts: ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
  },
  {
    name: 'Rajshahi',
    districts: [
      'Rajshahi',
      'Bogra',
      'Pabna',
      'Sirajganj',
      'Naogaon',
      'Natore',
      'Chapainawabganj',
      'Joypurhat',
    ],
  },
  {
    name: 'Khulna',
    districts: [
      'Khulna',
      'Jessore',
      'Kushtia',
      'Jhenaidah',
      'Satkhira',
      'Bagerhat',
      'Chuadanga',
      'Meherpur',
      'Narail',
      'Magura',
    ],
  },
  {
    name: 'Barisal',
    districts: [
      'Barisal',
      'Patuakhali',
      'Bhola',
      'Pirojpur',
      'Barguna',
      'Jhalokati',
    ],
  },
  {
    name: 'Rangpur',
    districts: [
      'Rangpur',
      'Dinajpur',
      'Gaibandha',
      'Kurigram',
      'Lalmonirhat',
      'Nilphamari',
      'Panchagarh',
      'Thakurgaon',
    ],
  },
  {
    name: 'Mymensingh',
    districts: ['Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur'],
  },
];

export const getDistrictsByDivision = (divisionName) => {
  const div = BANGLADESH_DIVISIONS.find(
    (d) => d.name.toLowerCase() === (divisionName || '').toLowerCase()
  );
  return div ? div.districts : [];
};
