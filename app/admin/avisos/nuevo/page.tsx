import { FloatingNavAdmin } from "../../components/FloatingNavAdmin";
import { CreateAnnouncementForm } from "../components/CreateForm";

export default function CreateAnnouncementPage() {
    return (
        <div className="container mx-auto px-4 py-8 mt-16 lg:mt-0">
            <FloatingNavAdmin />
            <CreateAnnouncementForm />
        </div>
    );
}