import appStoreBadge from '../assets/badges/app-store.svg';
import googlePlayBadge from '../assets/badges/google-play.svg';

type StoreBadgesProps = {
  className?: string;
  layout?: 'row' | 'column';
};

const StoreBadges = ({ className = '', layout = 'row' }: StoreBadgesProps) => {
  const layoutClass =
    layout === 'column' ? 'flex-col items-stretch' : 'flex-row flex-wrap items-center';

  if (layout === 'column') {
    return (
      <div className={`flex flex-col gap-3 ${className}`}>
        <a href="#" aria-label="Download on the App Store" className="hover:opacity-85 transition-opacity">
          <img src={appStoreBadge} alt="Download on the App Store" className="h-14 w-auto" />
        </a>
        <a href="#" aria-label="Get it on Google Play" className="hover:opacity-85 transition-opacity">
          <img src={googlePlayBadge} alt="Get it on Google Play" className="h-14 w-auto" />
        </a>
      </div>
    );
  }

  return (
    <div className={`flex flex-row flex-wrap items-center gap-2.5 ${className}`}>
      <a href="#" aria-label="Download on the App Store" className="inline-block hover:opacity-85 transition-opacity shrink-0">
        <img src={appStoreBadge} alt="Download on the App Store" className="h-12 w-auto" />
      </a>
      <a href="#" aria-label="Get it on Google Play" className="inline-block hover:opacity-85 transition-opacity shrink-0">
        <img src={googlePlayBadge} alt="Get it on Google Play" className="h-12 w-auto" />
      </a>
    </div>
  );
};

export default StoreBadges;
