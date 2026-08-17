import {
  CalendarCheck,
  Globe,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShoppingBag,
  ExternalLink,
  BriefcaseBusiness,
} from "lucide-react";

import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa6";

type Props = {
  type: string;
};

export default function ActionIcon({ type }: Props) {
  const className = "h-5 w-5";

  switch (type) {
    case "whatsapp":
      return <FaWhatsapp className={className} />;

    case "instagram":
      return <FaInstagram className={className} />;

    case "facebook":
      return <FaFacebook className={className} />;

    case "tiktok":
      return <FaTiktok className={className} />;

    case "youtube":
      return <FaYoutube className={className} />;

    case "linkedin":
      return <FaLinkedin className={className} />;

    case "call":
      return <Phone className={className} strokeWidth={2} />;

    case "email":
      return <Mail className={className} strokeWidth={2} />;

    case "location":
      return <MapPin className={className} strokeWidth={2} />;

    case "website":
      return <Globe className={className} strokeWidth={2} />;

    case "booking":
      return (
        <CalendarCheck
          className={className}
          strokeWidth={2}
        />
      );

    case "menu":
      return <Menu className={className} strokeWidth={2} />;

    case "shop":
      return (
        <ShoppingBag
          className={className}
          strokeWidth={2}
        />
      );

    case "portfolio":
      return (
        <BriefcaseBusiness
          className={className}
          strokeWidth={2}
        />
      );

    default:
      return (
        <ExternalLink
          className={className}
          strokeWidth={2}
        />
      );
  }
}