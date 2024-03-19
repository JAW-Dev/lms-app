import React, { useRef } from 'react';
import useResponsive from '../hooks/useResponsive';
import Slider from 'react-slick';
// Images
import Image1 from '../../../../assets/images/reskin-images/img--pick-path-1.png';
import Image2 from '../../../../assets/images/reskin-images/img--pick-path-2.png';
import Image3 from '../../../../assets/images/reskin-images/img--pick-path-3.png';
import FreeAccessVideo from '../../../../assets/images/reskin-images/img--get-access-free-video.png';
import FreeAccessBg from '../../../../assets/images/reskin-images/img--get-access-free-bg.png';
import getAccessBg from '../../../../assets/images/reskin-images/img--get-access-bg.svg';

const BasicCard = ({children}) => {
	return (
		<div className="relative bg-white w-full" style={{borderRadius: '32px', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 10px 50px'}}>
			{children}
		</div>
	);
}

const CardWrapper = ({children, width}) => {
	return (
		<div className="flex" style={{ width: width }}>
			<BasicCard>
				<div className="flex flex-col flex-no-wrap w-full h-full">
					{children}
				</div>
			</BasicCard>
		</div>
	)
}

const CardOne = ({imageStyles, buttonStyles}) => {
	return (
		<CardWrapper width="350px">
			<div className="flex flex-col w-full" style={{...imageStyles, backgroundImage: `url(${Image1})`}}></div>
			<div className="px-10 py-8">
				<h6 className="font-bold text-lg text-link-purple text-2xl">For Individuals</h6>
				<p className="pb-6 font-bold text-sm" style={{ maxWidth: '25ch'}}>Begin your journey to becoming a better leader.</p>
				<ul className="pb-6 text-charcoal text-sm" style={{paddingLeft: '1rem'}}>
					<li>100 Behaviors</li>
					<li>15 Hours of Video Content</li>
					<li>Extensive Study Materials</li>
					<li>10 Modules</li>
				</ul>
				<p className="pb-4 font-bold text-sm">
					Unlock a full year of access for a one-time investment of $1,000. Maintain your access for just $200 annually.
				</p>
			</div>
			<div className="px-6 pb-6 pt-2 mt-auto">
				<a href="/v2/users/access/me" style={buttonStyles}>Get Started Today</a>
			</div>
		</CardWrapper>
	);
}

const CardTwo = ({imageStyles, buttonStyles}) => {
	return (
		<CardWrapper width="350px">
			<div className="flex flex-col w-full" style={{...imageStyles, backgroundImage: `url(${Image2})`}}></div>
			<div className="px-10 py-8">
				<h6 className="font-bold text-lg text-link-purple text-2xl">For Teams</h6>
				<p className="pb-6 font-bold" style={{fontSize: '14px', maxWidth: '24ch'}}>Great leaders develop teams of great leaders.</p>
				<p class="text-charcoal text-sm">Learn more about:</p>
				<ul className="pb-6 text-charcoal text-sm" style={{paddingLeft: '1rem'}}>
					<li>Group Pricing</li>
					<li>Team Dialogues</li>
					<li>Individual Coaching</li>
				</ul>
				<p className="pb-4 font-bold text-sm">Contact us for custom team solutions</p>
			</div>
			<div className="px-6 pb-6 pt-2 mt-auto">
				<a href="/v2/users/access/team" style={buttonStyles}>Get Access for My Team</a>
			</div>
		</CardWrapper>
	);
}

const CardThree = ({imageStyles, buttonStyles,}) => {
	return (
		<CardWrapper width="350px">
			<div style={{...imageStyles, backgroundImage: `url(${Image3})`}}></div>
			<div className="px-10 py-8">
				<h6 className="font-bold text-lg text-link-purple text-2xl">For Non-Profit Leaders</h6>
				<p className="pb-6 font-bold text-sm">Better leaders make people better.</p>
				<p className="pb-6 text-charcoal text-sm">Admired Leadership content is ideal for all kinds of leaders in government, education, athletics, and the arts. Religious leaders and community workers as well.</p>
				<p className="pb-4 font-bold text-sm">Contact us for attractive course options.</p>
			</div>
			<div className="px-6 pb-6 pt-2 mt-auto">
				<a href="/v2/users/access/nonprofit" style={buttonStyles}>Get More Info</a>
			</div>
		</CardWrapper>
	);
}

const BottomCard = ({buttonStyles}) => {
	const { isTablet } = useResponsive();

	const freeAccessStyles = {
		width: '100%',
		maxWidth: isTablet ? '100%' : '1165px',
		height: isTablet ? '100%' : '250px'
	}

	const bgStyles = {
		backgroundImage: `url(${FreeAccessBg})`,
		backgroundSize: 'cover',
		borderTopRightRadius: '32px',
		borderBottomRightRadius: '32px'
	}

	return (
		<div className="flex flex-col items-center w-full">
			<div className="flex" style={{ maxWidth: isTablet ? '100%' : '1165px', margin: isTablet ? '0' : '0 auto', width: isTablet ? '350px' : '100%', }}>
				<BasicCard>
					<div className="flex flex-col-reverse md:flex-row w-full items-center" style={freeAccessStyles}>
						<div className="py-8 px-12" style={{width: isTablet ? '100%' : '50%'}}>
							<h6 className="pb-4 font-bold text-lg" style={{fontSize: '20px'}}>Not ready to enroll? No problem!</h6>
							<p className="pb-1" style={{fontSize: '14px'}}>Don't miss <span className="font-bold text-link-purple">An Introduction to Admired Leadership®</span></p>
							<p className="pb-8" style={{fontSize: '14px'}}>Watch our five complimentary foundational videos.</p>
							<a href="/v2/users/access/direct" style={{...buttonStyles, width: isTablet ? '100%' : 'auto'}}>Get Free Access</a>
						</div>
						<div className="flex flex-row items-center p-6" style={{...bgStyles, width: isTablet ? '100%' : '66%', height: '100%'}}>
							<img style={{borderRadius: '12px', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 10px 50px', transform: 'translateX(15px)'}} src={FreeAccessVideo} alt="Video still"/>
						</div>
					</div>
				</BasicCard>
			</div>
		</div>
	);
}


const PrevArrow = ({ onClick }) => (
	<button className="slick-arrow slick-prev" style={{display: 'block'}} onClick={onClick}>
	  	Previous
	</button>
);
  
const NextArrow = ({ onClick }) => (
	<button className="slick-arrow slick-next" style={{display: 'block'}} onClick={onClick}>
	 	 Next
	</button>
);
  
const CustomDots = ({ dots, goToPrev, goToNext }) => (
	<div className="flex items-center justify-center" style={{marginTop: '34px'}}>
		<PrevArrow onClick={goToPrev}/>
		<ul className="slick-dots">
			{dots.map((dot, index) => (
				<li key={index}>{dot}</li>
			))}
		</ul>
		<NextArrow onClick={goToNext}/>
	</div>
	
);

const TestimonialSlider = () => {
	const sliderRef = useRef();

	const goToNext = () => {
		console.log('click');
		if (sliderRef.current) {
		  sliderRef.current.slickNext();
		}
	  };
	
	const goToPrev = () => {
	if (sliderRef.current) {
		sliderRef.current.slickPrev();
	}
	};

	const settings = {
		dots: true,
		infinite: true,
		speed: 1000,
		autoplay: true,
		autoplaySpeed: 7000,
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		adaptiveHeight: true,
		appendDots: dots => <CustomDots dots={dots} goToPrev={goToPrev} goToNext={goToNext} />,
		responsive: [
			{
				breakpoint: 768,
				settings: {
					arrows: false,
					dots: false,
				}
			},
		]
	  };

	return (
		<div className="text-center flex flex-col items-center">
			<div>
				<h6 className="font-bold text-lg" style={{fontSize: '20px'}}>
					What leaders are saying about Admired Leadership
				</h6>
				<hr className="mb-4" style={{background: '#D1D1D1', maxWidth: '245px', height: '1px'}}/>
			</div>
			
			<div className="carousel-container" style={{maxWidth: '670px', width: '100%'}}>
				<Slider ref={sliderRef} {...settings}>
					<div>
						<div>I love this stuff. These are <strong>simple and actionable behaviors I can immediately apply to being a better coach and leader.</strong> Ultimately, I think those I lead will be more successful, fulfilled and valued as I more fully learn and practice these behaviors</div>
						<p className="text-link-purple pt-4">&mdash; Pac-12 Head Athletic Coach</p>
					</div>
					<div>
						<div>It is fantastic to be able to reference the content-rich behaviors and nuances on demand. For those so inclined, <strong>there is a lifetime of skills available at your fingertips.</strong> Having them available when I need them allows me to simply work on becoming a better leader at my own pace.</div>
						<p className="text-link-purple pt-4">&mdash; CEO National Wealth Management Company</p>
					</div>
					<div>
						<div>Having completed the Admired Leadership curriculum, I observe this is the most valuable leadership intellectual property I have experienced in 40 years of business and non-profit leadership. <strong>If you or your team truly aspires to reach the next level, this is it. 5 stars.</strong></div>
						<p className="text-link-purple pt-4">&mdash; Senior Vice President, Global Insurance Company</p>
					</div>
					<div>
						<div><strong>'When the student is ready, the teacher appears'</strong> ... I only wish I had been 'ready' 20 years ago, as the behaviors learned via Admired Leadership would have benefited both personal and professional relationships. <strong>Even the world's best athletes have coaches.</strong> Instincts alone will only take you so far.</div>
						<p className="text-link-purple pt-4">&mdash; Managing Director, Tier 1 Investment Bank</p>
					</div>
					<div>
						<div>A resource as engaging as it is insightful. The behaviors of admired leaders are <strong>thoroughly and concisely explained.</strong> The exercises and role plays designed to habituate the behaviors are great. I wish <strong>every pastor and seminary student could have access.</strong></div>
						<p className="text-link-purple pt-4">&mdash; Lutheran Pastor</p>
					</div>
					<div>
						<div>I told my son who is 18 going to college this fall that he should go through this as well because <strong>I wish I had this when I was 18.</strong> There is no collection of video's or books that will rival this series. I have been <strong>developing my leadership philosophy for 30 years and this is taking it to a whole new level.</strong></div>
						<p className="text-link-purple pt-4">&mdash; Dad, and Credit Union CFO</p>
					</div>
					<div>
						<div>I have to say I am really <strong>blown away by the quality of execution and the content.</strong> As an executive and a leader I have been a consumer of leadership development content my entire career. I have to say, this program is without a doubt the <strong>best content I have ever seen.</strong></div>
						<p className="text-link-purple pt-4">&mdash; Veteran early and growth stage CEO</p>
					</div>
					<div>
						<div>I am really excited about working with my teams. I have spent years talking with my teams about the benefits of feedback. The videos are so powerful and easy to change. The "more of or less of" behavior is <strong>so easy and powerful</strong> at the same time. <strong>This is great advice for work or personal.</strong></div>
						<p className="text-link-purple pt-4">&mdash; Credit Union CFO</p>
					</div>
					<div>
						<div><strong>The videos are great</strong> because they provide color and context to each behavior outline under each video. They get you to the point fast providing a great way to review the concepts. They add texture and bring the behavior to life. <strong>Even though they’re short, the content is dense.</strong></div>
						<p className="text-link-purple pt-4">&mdash; CEO and Founder, Asset Management Company</p>
					</div>
					<div>
						<div>I just love <strong>how practical it is</strong>. You want to <strong>motivate your team</strong>? Ok, <strong>here are seven specific things</strong> you can do to make it work. Verbally delivered, I’ve always found Admired Leadership® <strong>actionable and implementable</strong>. It’s amazing to see how you have systematized it.</div>
						<p className="text-link-purple pt-4">&mdash; CEO and Founder, Asset Management Company</p>
					</div>
					<div>
						<div>The true genius <strong>is the distillation of such complex ideas</strong> that have been developed over decades <strong>into such simple nuggets</strong>. It’s deep understanding, passion and spectacular editing <strong>make the profound so digestible and simple</strong>.</div>
						<p className="text-link-purple pt-4">&mdash; CEO and Founder, Asset Management Company</p>
					</div>
					<div>
						<div>I have taken away <strong>so many insights as a parent</strong> while watching these modules. I see the value of these behaviors in every aspect of my life. This has been incredibly valuable.</div>
						<p className="text-link-purple pt-4">&mdash; Parent & Technology Executive</p>
					</div>
				</Slider>
    		</div>
		</div>
	)
}

const PageContent = () => {
	const containerStyles = {
		backgroundImage: `url(${getAccessBg})`,
		backgroundSize: 'cover',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'top center',
		paddingTop: '2rem',
		paddingBottom: '125px'
	}

	const imageStyles = {
		borderTopLeftRadius: '32px',
		borderTopRightRadius: '32px',
		backgroundPosition: 'bottom center',
		backgroundRepeat: 'no-repeat',
		width: '100%',
		height: '300px'
	}

	const buttonStyles = {
		display: 'inline-block',
		width: '100%',
		fontSize: '14px',
		fontWeight: '700',
		color: 'white',
		textAlign: 'center',
		padding: '12px 24px',
		borderRadius: '16px',
		background: 'linear-gradient(90deg, #6357B5 0%, #8B7FDB 100%)'
	}

  return (
    <div className="pt-16">
			<div className="flex flex-col align-center justify-center w-full pr-8 pl-8">
				<h1 className="text-center font-black text-link-purple text-4xl mb-1">Get Full Access</h1>
				<p className="text-center mb-6 font-semibold text-2xl text-charcoal">Learn the habits, routines, and behaviors of the very best leaders.</p>
			</div>
			<div className="pr-8 pl-8" style={containerStyles}>
				<div className="flex flex-col md:flex-row justify-center flex-wrap lg:flex-nowrap content-center container" style={{gap: '3vw', marginBottom: '51px'}}>
					<CardOne imageStyles={imageStyles} buttonStyles={buttonStyles}/>
					<CardTwo imageStyles={imageStyles} buttonStyles={buttonStyles}/>
					<CardThree imageStyles={imageStyles} buttonStyles={buttonStyles}/>
				</div>
				<div className="container" style={{marginBottom: '90px'}}>
					<BottomCard buttonStyles={buttonStyles}/>
				</div>
				<div className="container">
					<TestimonialSlider/>
				</div>
			</div>
    </div>
  );
};

const GetAccess = () => {
	return (
		<main id="main" className="">
			<div id="content-wrapper" className="content-wrapper">
				<div id="content-inner" className="content-inner flex flex-col lg:flex-row relative">
					<div id="content-body" className="content-body w-full relative" style={{minHeight: '774px', left: '0px', margin: '0px'}}>
						<PageContent />
					</div>
				</div>
			</div>
		</main>
	)
};

export default GetAccess;