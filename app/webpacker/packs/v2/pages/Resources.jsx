import React, {useState} from 'react';
import { Main } from '../components/layouts/Layouts';
// Hooks
import useResponsive from '../hooks/useResponsive';

const LoadedImage = ({src, alt, width}) => {
	// add state for image loading
  const [imageLoaded, setImageLoaded] = useState(false);

	 // handle image loaded
	 const handleImageLoaded = () => {
    setImageLoaded(true);
  };

  // handle image loading error
  const handleImageError = () => {
    setImageLoaded(false);
  };

	return (
		<div style={{width: width}}>
			<img
				src={src}
				alt={alt}
				onLoad={handleImageLoaded}
				onError={handleImageError}
				style={{ display: !imageLoaded && 'none' }}
			/>
			{!imageLoaded && <div className="loading-colors w-full h-full absolute pin-t pin-l" />}
		</div>
	);
}

const BasicCard = ({children, classes}) => {
	return (
		<div
		className={`bg-white px-8 py-6 w-full ${classes}`}
		style={{borderRadius: '32px', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 10px 50px', gap: '16px'}}>
			{children}
		</div>
	);
}

const chunkArray = (myArray, chunk_size) => {
	let index = 0;
	let arrayLength = myArray.length;
	let tempArray = [];

	for (index = 0; index < arrayLength; index += chunk_size) {
		let chunk = myArray.slice(index, index+chunk_size);
		tempArray.push(chunk);
	}

	return tempArray;
};

const cardData = [
	{
		src: 'https://admiredleadership.com/wp-content/uploads/2020/07/icon-summaries.png',
		url: 'https://admiredleadership.com/resources/book-summaries/',
		name: 'Book Summaries',
		blurb: 'The latest and greatest books for leaders.'
	},
	{
		src: 'https://admiredleadership.com/wp-content/uploads/2020/07/icon-field-notes.png',
		url: 'https://admiredleadership.com/resources/field-notes/',
		name: 'Field Notes',
		blurb: 'Our thoughts on current leadership topics and questions.'
	},
	{
		src: 'https://explore.admiredleadership.com/assets/icon-events-e8b836389ca5a537bf5d6aebfb6fc698d1442bb966c215120d0298807dc2149f.png',
		url: 'https://admiredleadership.com/events/',
		name: 'Events',
		blurb: 'Live events and opportunities connected to Admired Leadership.'
	},
	{
		src: 'https://explore.admiredleadership.com/assets/icon-faqs-0334fe6b44136261aa4bd1eb057646578fca012df365136808f14e20d2719bcd.png',
		url: 'https://admiredleadership.com/frequently-asked-questions/',
		name: 'FAQs',
		blurb: 'Answers to common questions related to the Admired Leadership program.'
	},
	{
		src: 'https://explore.admiredleadership.com/assets/icon-navigation-270434f6c187a98c848ce15079ec795fbdc2ac32446f81d0ed46abf14b88c251.png',
		url: '/v2/program/course-navigation',
		name: 'Course Navigation',
		blurb: 'How do I select the behavior I should work on first?'
	}
];

const PageContent = () => {
	const chunkedData = chunkArray(cardData, 2);
	const { isTablet} = useResponsive();

  return (
    <>
      <h1 className="font-extrabold text-charcoal text-5xl mb-8">
				Resources
      </h1>
			{chunkedData.map((chunk, index) => (
        <div className="flex justify-between flex-col md:flex-row mb-8" style={{gap: '24px'}} key={index}>
          {chunk.map((item, idx) => (
						<a className="flex" href={item.url} style={{width: isTablet ? '100%' : 'calc( 50% - 24px)', color: '#3c3c3c'}}>
							<BasicCard classes="flex flex-col md:flex-row items-start md:items-center" key={idx}>
								<LoadedImage src={item.src} alt={item.name} width="100px"/>
								<div className="flex flex-col justify-center" style={{minHeight: isTablet ? '0' : '100px'}}>
									<h3 className="font-normal" style={{fontSize: '20px'}}>{item.name}</h3>
									<p>{item.blurb}</p>
								</div>
							</BasicCard>
						</a>
          ))}
        </div>
      ))}
    </>
  );
};

const options = {
  content: <PageContent />,
  layout: 'full',
  wrapperClasses: 'flex justify-center',
  innerStyle: { width: '100%', maxWidth: '1400px' }
};

const Resources = () => <Main options={options} />;

export default Resources;