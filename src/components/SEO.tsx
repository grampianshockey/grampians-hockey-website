import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
}

const SEO = ({ title, description }: SEOProps) => {
  useEffect(() => {
    const fullTitle = `${title} | Grampians Hockey Club`;
    document.title = fullTitle;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", description);
    }

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", fullTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", description);

    return () => {
      document.title = "Grampians Hockey Club | Ararat & Ballarat, Victoria";
    };
  }, [title, description]);

  return null;
};

export default SEO;
