import { KisaanMitraChatFloater } from "@/components/kisaan-mitra/chat-floater";

export default function AgentPage() {
    return (
        <div className="w-full h-full min-h-[calc(100vh-100px)] relative">
            <KisaanMitraChatFloater defaultOpen={true} />
        </div>
    );
}
