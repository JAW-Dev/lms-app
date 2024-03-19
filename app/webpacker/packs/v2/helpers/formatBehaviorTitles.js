const formatBehaviorTitles = (modules) => {

  if(!modules) {
    return [];
  }

  return modules.map((module, moduleIndex) => {
    module.behaviors = module.behaviors.map((behavior, behaviorIndex) => {
      if (moduleIndex === 0) {
        if (behaviorIndex === 0) {
          behavior.behaviorNumber = "Introduction to Foundational Principles";
        } else {
          behavior.behaviorNumber = `Foundational Principle ${behaviorIndex}`;
        }
      } else if (moduleIndex === 1) {
        if (behaviorIndex === 0) {
          behavior.behaviorNumber = "Introduction";
        } else {
          behavior.behaviorNumber = `Introduction to Module ${moduleIndex - 1}`;
        }
      } else {
        if (behaviorIndex === 0) {
          behavior.behaviorNumber = `Introduction to Module ${moduleIndex - 1}`;
        } else {
          behavior.behaviorNumber = `Module ${moduleIndex - 1}.${behaviorIndex}`;
        }
      }
      return behavior;
    });
    return module;
  });
}

export default formatBehaviorTitles;