const getLastCompletedBehavior = (moduleBehaviors) => {
	for (let i = moduleBehaviors?.length - 1; i >= 0; i--) {
			if (moduleBehaviors[i].completed === true) {
					return moduleBehaviors[i];
			}
	}
	return moduleBehaviors?.[0]; // return the first behavior
}

export default getLastCompletedBehavior;