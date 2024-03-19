const truncate = (str, n) => {
  let trimmed = str.substr(0, n);
  trimmed = trimmed.substr(
    0,
    Math.min(trimmed.length, trimmed.lastIndexOf(' '))
  );
  return trimmed + '...';
};
export const shortenContent = (html, maxWords = 20) => {
  // Extract the text content from the HTML
  const textContent = new DOMParser().parseFromString(html, 'text/html').body
    .textContent;

  // Split the text content into words
  const words = textContent.trim().split(/\s+/);

  // Take the first maxWords words and join them back together with spaces
  const shortenedText = words.slice(0, maxWords).join(' ');

  // Add an ellipsis at the end if there are more than maxWords words
  if (words.length > maxWords) {
    return `${shortenedText}...`;
  } else {
    return shortenedText;
  }
};

export const convertVideoTime = (videoLengthInSeconds) => {
  const videoTimeInMinutes = Math.floor(videoLengthInSeconds / 60);
  const text = videoLengthInSeconds > 60 ? 'minutes' : 'minute';

  return `${videoTimeInMinutes} ${text}`;
};

export const convertToDollarString = (cents) => {
  if (cents === 0 || !cents) return '---';
  const amountInDollars = cents / 100;
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return formatter.format(amountInDollars);
};

export const formatDate = (date) => {
  const inputDate = new Date(date);
  return inputDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const convertHubSpotLabel = (field) => {
  const labels = {
    access_type: 'Access Type',
    source: 'Referral Access',
    source_person: 'Source Person',
    profile_url: 'View on HubSpot',
    what_inspired_you_to_buy_admired_leadership_:
      'What inspired you to sign up?',
  };

  return (
    labels[field] ||
    labels[String(field)] ||
    String(field)
      .replace(/_+/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase())
  );
};


export function shortenParagraph(paragraph, length = 200) {
  const maxCharacters = length;

  // Split the paragraph into sentences
  const sentences = paragraph.match(/[^\.!\?]+[\.!\?]+/g) || [];

  let shortened = '';
  let currentLength = 0;

  for (let sentence of sentences) {
    if (currentLength + sentence.length <= maxCharacters) {
      shortened += sentence;
      currentLength += sentence.length;
    } else {
      break;
    }
  }

  return shortened;
}


export default { truncate };
