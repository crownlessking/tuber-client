import devCallbacks from './dev.callbacks';
import prodCallbacks from './prod.callbacks';

export default function tuber_register_callbacks() {
  Object.defineProperty(window, 'tuberCallbacks', {
    value: {
      ...prodCallbacks,
      ...devCallbacks
    },
    writable: false
  });
}
