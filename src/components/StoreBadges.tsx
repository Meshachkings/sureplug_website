import appStoreBadge from '../assets/badges/app-store.svg';
import googlePlayBadge from '../assets/badges/google-play.svg';

type StoreBadgesProps = {
  className?: string;
  layout?: 'row' | 'column';
};

const StoreBadges = ({ className = '', layout = 'row' }: StoreBadgesProps) => {
  const layoutClass =
    layout === 'column' ? 'flex-col items-stretch' : 'flex-row flex-wrap items-center';

  return (
    <div className={`flex gap-3 ${layoutClass} ${className}`}>
      <a href="#" aria-label="Download on the App Store" className="inline-block hover:opacity-85 transition-opacity">
        <img src={appStoreBadge} alt="Download on the App Store" className="h-12 w-[144px]" />
      </a>
      <a href="#" aria-label="Get it on Google Play" className="inline-block hover:opacity-85 transition-opacity">
        <img src={googlePlayBadge} alt="Get it on Google Play" className="h-12 w-[144px]" />
      </a>
    </div>
  );
};

export default StoreBadges;
