import React from 'react';
// Components
import { Main } from './../components/layouts/Layouts';

const Content = () => {
	return (
		<>
      <h1 style={{ fontSize: '48px' }} className="text-charcoal font-extrabold  mb-4">Course Navigation</h1>
			<div style={{maxWidth: '700px'}}>
				<div
					class="mb-8"
					style={{
						position: 'relative',
						paddingBottom: '56.25%',
						height: '0',
						overflow: 'hidden',

					}}>
					<iframe
						allow="autoplay; fullscreen; picture-in-picture; camera; microphone; display-capture"
						allowfullscreen=""
						allowtransparency="true"
						referrerpolicy="no-referrer-when-downgrade"
						className="vidyard-iframe-PkmXdCuBRQPvFrcf9USLX4"
						frameborder="0"
						height="100%"
						width="100%"
						scrolling="no"
						src="https://play.vidyard.com/PkmXdCuBRQPvFrcf9USLX4?disable_popouts=1&amp;v=4.3.13&amp;type=inline"
						title="Admired Leadership Overview"
						style={{
							opacity: '1',
							backgroundColor: 'transparent',
							position: 'absolute',
							top: '0',
							left: '0',
							width: '100%',
							height: '100%'
						}}></iframe>
				</div>
				<p className="mb-4">The Admired Leadership course contains a mountain of new ideas and information. The course contains more than 15 hours of video presentations, and thousands of examples, exercises, outlines and study questions. This can be overwhelming without a learning strategy. Before we discuss how to navigate the course, we first must highlight how to learn a given Admired Leadership, to make it your own, and to turn it into a habit.</p>
				<h2 className="font-extrabold mb-4" style={{fontSize: '24px', letterSpacing: '-1.2px'}}>Mastering a Behavior</h2>
				<p className="mb-4">Mastering Admired Leadership behaviors and routines is best done by focusing exclusively on one behavior for a period of 2-6 weeks. Turning a behavior into habit requires a commitment to focus on the behavior by doing it, in at least one relationship or setting, every day. Try hard not to miss a day! Critical to this action is keeping a log of your success and learning, observing others to see how they do or do not model the behavior and reflecting about opportunities missed when you had a chance to use the behavior but failed to do so. Sometimes, this reflection will give you chance to suggest how you could have behaved in your log. If you're making good progress over time, the next step is to expand the use of the behavior multiple times a day and give it your own unique expression and style. The more practice and repetition, the better. By doing this tedious work, you will soon make any behavior a part of your everyday leadership style and it will become a habit that occurs without much thought. Once you have mastered the behavior, there is no time like the present to begin on the next one. As it says on the bottle, "Rinse and repeat."</p>
				<p className="mb-4">The question is: How do I select the behavior I should work on first?</p>
				<p className="mb-4">Leaders who have taken the course have told us they generally followed one of two learning routes to navigate the course.</p>
				<h2 className="font-extrabold mb-4" style={{fontSize: '24px', letterSpacing: '-1.2px'}}>Improvement Route</h2>
				<p className="mb-4">Following this route suggests selecting the module which is of greatest interest to you. Once selected, watch all of the videos and explore the outlines and examples for each of the 10 behaviors and the introduction. Take a few notes to highlight those ideas that resonate strongly with you. Now select the behavior you most want to master and focus exclusively on it until it becomes a part of your everyday leadership style. Repeat this with every behavior in the module. Now move to another module of interest.</p>
				<p className="mb-4">Leaders who have received feedback which points to a particular module and leaders who want to take a leadership strength from good to great should also consider this route.</p>
				<h2 className="font-extrabold mb-4" style={{fontSize: '24px', letterSpacing: '-1.2px'}}>Exploratory Route</h2>
				<p className="mb-4">If it is not clear where to start your learning, the best place to start is at the beginning. In this route, leaders watch and explore every module and behavior in sequence over time. Plowing through more than 100 videos and behavior maps will take commitment and considerable time. Pace yourself. Take notes during your video journey and highlight those behaviors that most resonate with your interests, values and passions. Now select the module with the behaviors you found most compelling. Re-watch and explore the introduction and each of the behaviors within that module. Now select the behavior to focus on first. Work hard to master this behavior and then repeat this process until you have made every behavior in the module a part of your everyday leadership style. Repeat with other modules containing behaviors of interest.</p>
				<p className="mb-4">Leaders who just love to learn or are looking for ways to "live" their leadership values should consider this route.</p>
				<h2 className="font-extrabold mb-4" style={{fontSize: '24px', letterSpacing: '-1.2px'}}>Beginnings Are Hard</h2>
				<p className="mb-4">Of course, there are no "right" routes, so these suggestions are meant to help you to navigate the course and decide where and how to start becoming a better leader. The key is to find a behavior of interest and to commit to making it an authentic part of your leadership style through practice and repetition.</p>
				<p className="mb-4">Truly mastering all 100 behaviors will take years to accomplish. Don't let this stop you from starting the learning process. Mastering even a handful of these timeless routines will transform how others experience your leadership.</p>
			</div>
		</>
	)
}

const options = {
  content: <Content />,
  layout: 'full',
  wrapperClasses: 'flex justify-center',
  innerStyle: { width: '100%', maxWidth: '1400px' }
};

const CourseNavigation = () => <Main options={options} />;

export default CourseNavigation;