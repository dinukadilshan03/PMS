// app/Album-Portfolio/portfolio/[id]/edit/page.tsx

import EditPortfolioForm from "@/app/Album-Portfolio/portfolio/components/EditPortfolioForm";

type Props = {
    params: {
        id: string;
    };
};

export default function EditPortfolioPage({ params }: Props) {
    return (
        <div>
            <EditPortfolioForm />
        </div>
    );
}
