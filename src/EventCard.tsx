import * as React from "react";
import { Event } from "./types";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  IconButton,
  styled,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { pink } from "@mui/material/colors";

interface EventCardProps {
  event: Event;
  isSelected?: boolean;
  onSelect?: (id: number) => void;
  onDoubleClick?: () => void;
  onDelete?: (id: number) => void;
}

const StyledCardActionArea = styled(CardActionArea)(({ theme }) => ({
  "&:hover, &.Mui-focusVisible": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
  "&.Mui-selected": {
    backgroundColor: "rgba(255, 0, 0, 0.08)",
  },
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  paddingRight: theme.spacing(1),
}));

export const EventCard = ({
  event,
  isSelected,
  onSelect,
  onDoubleClick,
  onDelete,
}: EventCardProps) => {
  return (
    <Card>
      <StyledCardActionArea
        onClick={() => onSelect && onSelect(event.id)}
        onDoubleClick={onDoubleClick}
        className={isSelected ? "Mui-selected" : ""}
      >
        <CardContent sx={{ flex: 1, textAlign: "center" }}>
          <Typography variant="h5" component="div">
            {event.name}
          </Typography>
          <Typography gutterBottom>{event.company}</Typography>
          <Typography variant="body2" color="text.secondary">
            {event.description}
          </Typography>
        </CardContent>
        {isSelected && onDelete && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onDelete(event.id);
            }}
            aria-label="delete"
            sx={{ color: pink[500] }}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        )}
      </StyledCardActionArea>
    </Card>
  );
};
