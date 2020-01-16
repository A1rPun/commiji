const Emoji = (name, ascii, label = '') => {
  return { name, ascii, label };
};

const types = {
  build: [
    Emoji('construction_worker', '👷'),
    Emoji('construction', '🚧'),
    Emoji('wrench', '🔧'),
    Emoji('package', '📦'),
  ],
  ci: [
    Emoji('green_heart', '💚'),
    Emoji('blue_heart', '💙'),
    Emoji('purple_heart', '💜'),
    // Emoji('??', '🧩'),
  ],
  chore: [
    Emoji('fire', '🔥'),
    Emoji('pushpin', '📌'),
    Emoji('label', '🏷️'),
    Emoji('speech_balloon', '💬'),
    Emoji('poop', '💩'),
  ],
  docs: [
    Emoji('pencil', '📝'),
    Emoji('pencil2', '✏️'),
    Emoji('scroll', '📜'),
    Emoji('bulb', '💡'),
  ],
  feat: [
    Emoji('sparkles', '✨'),
    Emoji('star', '⭐'),
    Emoji('triangular_flag_on_post', '🚩', 'Feature flag'),
  ],
  fix: [Emoji('bug', '🐛'), Emoji('lock', '🔒'), Emoji('ambulance', '🚑')],
  perf: [
    Emoji('zap', '⚡'),
    Emoji('dart', '🎯'),
    Emoji('chart_with_upwards_trend', '📈'),
  ],
  refactor: [
    Emoji('cyclone', '🌀'),
    Emoji('recycle', '♻️'),
    Emoji('building_construction', '🏗'),
  ],
  revert: [
    Emoji('rewind', '⏪'),
    Emoji('boom', '💥'),
    Emoji('twisted_rightwards_arrows', '🔀', 'Merge'),
  ],
  style: [
    Emoji('cop', '👮'),
    Emoji('lipstick', '💄'),
    Emoji('nail_care', '💅'),
    Emoji('art', '🎨'),
    Emoji('rotating_light', '🚨'),
    Emoji('ok_hand', '👌'),
  ],
  test: [
    Emoji('white_check_mark', '✅'),
    Emoji('heavy_check_mark', '✔️'),
    Emoji('bar_chart', '📊'),
    Emoji('goal_net', '🥅'),
    Emoji('clown_face', '🤡', 'Mocking'),
    Emoji('alembic', '⚗', 'Expiriment'),
  ],
};

const extraTypes = {
  init: [Emoji('airplane', '✈'), Emoji('tada', '🎉'), Emoji('rocket', '🚀')],
  os: [
    Emoji('pinguin', '🐧', 'Linux'),
    Emoji('apple', '🍎', 'macOS'),
    Emoji('robot', '🤖', 'Android'),
    Emoji('green_apple', '🍏', 'iOS'),
    Emoji('bento', '🍱', 'Windows'),
  ],
  tools: [
    Emoji('whale', '🐳', 'Docker'),
    Emoji('wheel_of_dharma', '☸️', 'Kubernetes'),
    Emoji('seedling', '🌱', 'Mongo'),
    Emoji('elephant', '🐘', 'PHP or Postgres'),
    Emoji('coffee', '☕', 'CoffeeScript'),
    Emoji('hotsprings', '♨️', 'Java'),
  ],
};

module.exports = { types, extraTypes };
