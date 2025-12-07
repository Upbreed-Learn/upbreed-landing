import About from './about';
import Hero from './hero';
import Others from './others';

const CourseDetails = () => {
  return (
    <>
      <Hero />
      <div className="bg-white">
        <About />
        <Others />
      </div>
    </>
  );
};

export default CourseDetails;
