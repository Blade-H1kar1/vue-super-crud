export default {
  mockComponentName(instance, { Random, Mock, Preset }) {
    return Random.pick(Preset.mockComponentName);
  },
};
