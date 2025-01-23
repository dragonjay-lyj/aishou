// src/components/TwikooComment.tsx

import React, { useEffect } from 'react';

interface TwikooCommentProps {
  envId: string;
  region?: string;
  path?: string;
  lang?: string;
}

const TwikooComment: React.FC<TwikooCommentProps> = ({
  envId,
  region,
  path = window.location.pathname,
  lang,
}) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/twikoo@1.6.40/dist/twikoo.all.min.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (typeof window.twikoo !== 'undefined') {
        window.twikoo.init({
          envId,
          el: '#tcomment',
          region,
          path,
          lang,
        });
      } else {
        console.error('Twikoo failed to load.');
      }
    };

    return () => {
      document.body.removeChild(script);
      // Optional: Destroy twikoo instance when component unmounts
      // if (typeof window.twikoo !== 'undefined') {
      //   window.twikoo.destroy();
      // }
    };
  }, [envId, region, path, lang]);

  return <div id="tcomment"></div>;
};

export default TwikooComment;