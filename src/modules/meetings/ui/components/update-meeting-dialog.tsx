import ResponsiveDialog from "@/components/responsive-dialog";
import { MeetingForm } from "./meeting-form";
import { MeetingGetOne } from "../../types";

interface NewAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: MeetingGetOne;
}

const UpdateMeetingDialog = ({
  open,
  onOpenChange,
  initialValues,
}: NewAgentDialogProps) => {
  return (
    <>
      <ResponsiveDialog
        title="Edit Meeting"
        description="Edit the meeting details"
        open={open}
        onOpenChange={onOpenChange}
      >
        <MeetingForm
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
          initialValues={initialValues}
        />
      </ResponsiveDialog>
    </>
  );
};

export default UpdateMeetingDialog;
