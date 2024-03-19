const getBehaviorIndex = (module, behavior) => module.behaviors
  .map((curr) => curr.id)
  .indexOf(behavior.id);

export default getBehaviorIndex;
