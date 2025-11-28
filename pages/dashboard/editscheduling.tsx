import CalendarECPEdit from "@/components/calendarEcp/CalendarECPEdit";
import React from "react";

const Editscheduling = () => {
  return (
    <div>
      <div className="mb-5">
        <span className="text-careBlue">
          Aqui você pode editar os dias e horários disponiveis para
          agendamentos.
        </span>
      </div>

      <CalendarECPEdit />
    </div>
  );
};

export default Editscheduling;
