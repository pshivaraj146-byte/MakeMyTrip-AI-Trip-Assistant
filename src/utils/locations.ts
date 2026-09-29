export const MASTER_LOCATIONS = [
  // Tier 1
  'Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
  // North India
  'Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj', 'Meerut', 'Gorakhpur', 'Bareilly', 'Mathura',
  'Jaipur', 'Udaipur', 'Jodhpur', 'Jaisalmer', 'Ajmer', 'Pushkar', 'Bikaner', 'Mount Abu', 'Kota',
  'Shimla', 'Manali', 'Dharamshala', 'McLeod Ganj', 'Kullu', 'Kasol', 'Dalhousie', 'Spiti Valley',
  'Dehradun', 'Rishikesh', 'Haridwar', 'Nainital', 'Mussoorie', 'Jim Corbett', 'Auli', 'Kedarnath', 'Badrinath',
  'Amritsar', 'Ludhiana', 'Chandigarh', 'Patiala',
  'Srinagar', 'Gulmarg', 'Pahalgam', 'Jammu', 'Sonamarg',
  // West India
  'Nagpur', 'Nashik', 'Aurangabad', 'Kolhapur', 'Lonavala', 'Khandala', 'Mahabaleshwar', 'Alibaug', 'Shirdi', 'Ratnagiri', 'Tarkarli',
  'Surat', 'Vadodara', 'Rajkot', 'Bhuj', 'Dwarka', 'Somnath', 'Gir', 'Statue of Unity', 'Saputara',
  'Panaji', 'North Goa', 'South Goa', 'Calangute', 'Baga', 'Candolim', 'Anjuna', 'Vagator', 'Arambol', 'Palolem', 'Margao',
  // South India
  'Mysuru', 'Mangaluru', 'Hubballi', 'Dharwad', 'Belagavi', 'Shivamogga', 'Tumakuru', 'Ballari', 'Udupi', 'Coorg', 'Madikeri', 'Chikmagalur', 'Hampi', 'Gokarna', 'Sakleshpur', 'Dandeli', 'Kabini', 'Jog Falls',
  'Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kannur', 'Kollam', 'Alappuzha', 'Munnar', 'Varkala', 'Wayanad', 'Thekkady', 'Kumarakom', 'Bekal',
  'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', 'Tirunelveli', 'Ooty', 'Kodaikanal', 'Rameswaram', 'Kanyakumari', 'Yercaud', 'Mahabalipuram', 'Puducherry',
  'Warangal', 'Nizamabad', 'Karimnagar',
  'Visakhapatnam', 'Vijayawada', 'Tirupati', 'Guntur', 'Nellore', 'Kakinada', 'Rajahmundry', 'Araku Valley',
  // Central India
  'Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Khajuraho', 'Orchha', 'Pachmarhi',
  'Raipur', 'Bilaspur', 'Jagdalpur',
  // East India
  'Darjeeling', 'Siliguri', 'Digha', 'Kalimpong',
  'Bhubaneswar', 'Cuttack', 'Puri', 'Konark', 'Rourkela', 'Gopalpur',
  'Patna', 'Gaya', 'Bodh Gaya', 'Rajgir', 'Nalanda',
  'Ranchi', 'Jamshedpur', 'Dhanbad', 'Deoghar',
  // Northeast India
  'Guwahati', 'Kaziranga', 'Dibrugarh', 'Jorhat', 'Tezpur',
  'Shillong', 'Cherrapunji', 'Mawlynnong',
  'Gangtok', 'Pelling', 'Namchi',
  'Tawang', 'Itanagar', 'Ziro', 'Bomdila',
  'Kohima', 'Dimapur',
  'Agartala', 'Aizawl', 'Imphal',
  // International
  'Dubai', 'Abu Dhabi', 'Sharjah', 'Ras Al Khaimah', 'Fujairah', 'Ajman', 'Al Ain',
  'Bangkok', 'Phuket', 'Chiang Mai', 'Pattaya', 'Krabi', 'Koh Samui', 'Ayutthaya', 'Hua Hin', 'Chiang Rai', 'Koh Phi Phi',
  'Singapore',
  'Kuala Lumpur', 'Penang', 'George Town', 'Langkawi', 'Johor Bahru', 'Malacca', 'Melaka',
  'Kathmandu', 'Pokhara', 'Chitwan', 'Lumbini', 'Nagarkot',
  'Colombo', 'Kandy', 'Galle', 'Bentota', 'Nuwara Eliya', 'Ella', 'Sigiriya',
  'Bali', 'Jakarta', 'Yogyakarta', 'Bandung', 'Lombok',
  'Hanoi', 'Ho Chi Minh City', 'Da Nang', 'Hoi An', 'Nha Trang', 'Phu Quoc',
  'Male', 'Maafushi',
  'Thimphu', 'Paro', 'Punakha'
];

const ALIAS_MAP: Record<string, string> = {
  'bangalore': 'Bengaluru',
  'mysore': 'Mysuru',
  'bombay': 'Mumbai',
  'madras': 'Chennai',
  'cochin': 'Kochi',
  'trivandrum': 'Thiruvananthapuram',
  'calcutta': 'Kolkata',
  'delhi / ncr': 'Delhi',
  'new delhi': 'Delhi',
  'poona': 'Pune',
  'benares': 'Varanasi',
  'pondicherry': 'Puducherry'
};

export function normalizeLocation(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();
  if (ALIAS_MAP[lower]) {
    return ALIAS_MAP[lower];
  }
  const found = MASTER_LOCATIONS.find(loc => loc.toLowerCase() === lower);
  return found || trimmed;
}
