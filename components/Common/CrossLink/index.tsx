import classNames from 'classnames';
import type { FC } from 'react';

import PrevNextArrow from '@/components/Common/PrevNextArrow';
import Link from '@/components/Link';
import type { FormattedMessage } from '@/types/i18n';

import styles from './index.module.css';

type CrossLinkProps = {
  type: 'previous' | 'next';
  text: FormattedMessage;
  link: string;
};

const crossLink: Record<string, string> = {
  previous: 'Prev',
  next: 'Next',
};

const CrossLink: FC<CrossLinkProps> = ({ type, text, link }) => {
  return (
    <Link className={styles.crossLink} href={link}>
      <span
        className={classNames(styles.header, {
          [styles.reverse]: type === 'next',
        })}
      >
        <PrevNextArrow className={styles.icon} type={type} />
        {crossLink[type]}
      </span>

      <span
        className={classNames(styles.content, {
          [styles.reverse]: type === 'next',
        })}
      >
        {text}
      </span>
    </Link>
  );
};

export default CrossLink;
