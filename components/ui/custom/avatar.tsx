import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const AvatarCustom = (props: {
  src: string | any;
  alt: string;
  fallback: string;
  className?: string;
}) => {
  return (
    <Avatar
      className={cn(
        'size-9 text-sm/[100%] font-semibold text-black',
        props.className,
      )}
    >
      <AvatarImage
        src={props.src}
        alt={props.alt}
        className="object-cover object-top"
      />
      <AvatarFallback className="bg-[#D0EA50]">{props.fallback}</AvatarFallback>
    </Avatar>
  );
};

export default AvatarCustom;
