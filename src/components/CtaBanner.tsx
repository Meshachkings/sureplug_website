import { Link } from 'react-router-dom';
import ctaTasker from '../assets/cta-tasker.png';

const CtaBanner = () => {
  return (
    <section className="section-wrap pt-0">
      <div className="relative overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] bg-[#1b3d34]">
        <div className="relative flex flex-col lg:block lg:min-h-[360px] xl:min-h-[400px]">
          <div className="relative z-10 flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:max-w-[52%] lg:px-12 lg:py-14 xl:py-16">
            <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-semibold text-white tracking-tight leading-tight">
              Ready to Start?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-white/75 leading-relaxed max-w-md">
              Sign up today and connect with top taskers to get your job done.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <Link to="/become-a-provider" className="btn-pill-lime w-full sm:w-auto sm:min-w-[180px]">
                Become A Tasker
              </Link>
              <Link to="/taskers" className="btn-pill-cta-secondary w-full sm:w-auto sm:min-w-[180px]">
                View All Taskers
              </Link>
            </div>
          </div>

          <div className="relative lg:absolute lg:inset-y-0 lg:right-0 lg:w-[52%] xl:w-[50%] flex items-end justify-center lg:justify-end px-2 pt-4 pb-0 lg:pr-4 lg:pt-6 lg:pb-0 pointer-events-none">
            <img
              src={ctaTasker}
              alt="SurePlug tasker ready to help"
              className="h-[270px] sm:h-[340px] lg:h-[360px] xl:h-[390px] w-auto max-w-none object-contain object-bottom translate-y-2 sm:translate-y-3 lg:translate-y-4"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;
