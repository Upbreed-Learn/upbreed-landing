import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const NewsContent = () => {
  return (
    <div className="flex flex-col gap-9">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
      <div className="flex items-center justify-between text-[#305B43] [&_p]:text-xs/[100%] [&_p]:font-medium">
        <Link href={'/news/1'} className="flex items-center gap-2">
          <ArrowLeft />
          <p>Previous Post</p>
        </Link>
        <Link href={'/news/1'} className="flex items-center gap-2">
          <p>Next Post</p>
          <ArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default NewsContent;
