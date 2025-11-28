import NewModal from "@/components/modals/NewModal";
import EditPartiner from "@/components/partiner/EditPartiner";
import useEditPartiner from "@/hooks/useEditPartiner";

const EditPartinerModal = ({ refreshTable }: { refreshTable: () => void }) => {
    const editPartiner = useEditPartiner();

    return (
        <NewModal
            isOpen={editPartiner.isOpen}
            onClose={editPartiner.onClose}
            isCloseIconVisible={true}
            isButtonDisabled={true}
            customClass="w-full max-w-[1280px] max-h-[90vh] mx-auto no-border edit-header"
        >
            <EditPartiner refreshTable={refreshTable} />
        </NewModal>
    );
};

export default EditPartinerModal;
