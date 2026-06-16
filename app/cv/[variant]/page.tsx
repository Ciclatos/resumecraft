import { notFound } from "next/navigation";
import { Resume } from "../../../components/Resume";
import { variants } from "../../../data/variants";

type PageProps = {
  params: Promise<{
    variant: string;
  }>;
};

export function generateStaticParams() {
  return Object.keys(variants).map((variant) => ({ variant }));
}

export async function generateMetadata({ params }: PageProps) {
  const { variant } = await params;
  const data = variants[variant];

  if (!data) {
    return {};
  }

  return {
    title: `${data.name} | Carlos Díaz`,
    description: data.metaDescription,
  };
}

export default async function CvVariantPage({ params }: PageProps) {
  const { variant } = await params;
  const data = variants[variant];

  if (!data) {
    notFound();
  }

  return <Resume variant={data} />;
}
