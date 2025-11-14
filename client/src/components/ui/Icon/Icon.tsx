import type { SVGAttributes } from 'react';

export interface IconProps extends SVGAttributes<SVGElement> {
    size?: number;
}

export const HomeIcon = ({ size = 24, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <path
            d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const SearchIcon = ({ size = 24, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const UsersIcon = ({ size = 24, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const PlusIcon = ({ size = 24, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const TrophyIcon = ({ size = 24, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 20H6M12 16v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 4h12v5a6 6 0 01-12 0V4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const ImageIcon = ({ size = 24, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const ArrowUpIcon = ({ size = 24, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const ArrowDownIcon = ({ size = 24, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const MessageIcon = ({ size = 24, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const ShareIcon = ({ size = 24, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const MoreIcon = ({ size = 24, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <circle cx="19" cy="12" r="1" fill="currentColor" />
        <circle cx="5" cy="12" r="1" fill="currentColor" />
    </svg>
);

export const FlagIcon = ({ size = 24, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const UserIcon = ({ size = 24, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const SettingsIcon = ({ size = 24, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 1v6m0 6v10M1 12h6m6 0h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const LogoutIcon = ({ size = 24, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const BellIcon = ({ size = 24, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const XIcon = ({ size = 24, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const CheckIcon = ({ size = 24, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const MenuIcon = ({ size = 24, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const ChevronDownIcon = ({ size = 24, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const ShieldIcon = ({ size = 24, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const StarIcon = ({ size = 24, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Icon map for dynamic icon selection
const iconMap = {
    home: HomeIcon,
    search: SearchIcon,
    users: UsersIcon,
    plus: PlusIcon,
    trophy: TrophyIcon,
    image: ImageIcon,
    'arrow-up': ArrowUpIcon,
    'arrow-down': ArrowDownIcon,
    message: MessageIcon,
    share: ShareIcon,
    more: MoreIcon,
    flag: FlagIcon,
    user: UserIcon,
    settings: SettingsIcon,
    logout: LogoutIcon,
    bell: BellIcon,
    x: XIcon,
    check: CheckIcon,
    menu: MenuIcon,
    'chevron-down': ChevronDownIcon,
    shield: ShieldIcon,
    star: StarIcon,
};

export type IconName = keyof typeof iconMap;

interface IconComponentProps extends IconProps {
    name: IconName;
    className?: string;
}

export function Icon({ name, ...props }: IconComponentProps) {
    const IconComponent = iconMap[name];
    if (!IconComponent) {
        console.warn(`Icon "${name}" not found`);
        return null;
    }
    return <IconComponent {...props} />;
}
