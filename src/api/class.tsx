import { getId } from '../util/id.js';

const CLASS_PREFIX = '_rms_';
const ID_CLASS_PREFIX = '_rmsid_';

const getIdClass = () => ID_CLASS_PREFIX + getId();

const getStyleClass = (hash: number) => CLASS_PREFIX + (hash >>> 0).toString(36);

const getClasses = (className?: string): [simpleClasses: string | undefined, styledClasses: string | undefined] => {
  const simpleClasses: string[] = [];
  const styledClasses: string[] = [];

  if (typeof className === 'string') {
    className.split(/\s+/g).forEach((value) => {
      if (value.startsWith(CLASS_PREFIX)) {
        styledClasses.push(value);
      } else if (value) {
        simpleClasses.push(value);
      }
    });
  }

  return [simpleClasses.join(' ') || undefined, styledClasses.join(' ') || undefined];
};

export { getClasses, getIdClass, getStyleClass };
