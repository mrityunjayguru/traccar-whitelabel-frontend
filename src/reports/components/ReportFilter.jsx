import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { useTranslation } from "../../common/components/LocalizationProvider";
import { devicesActions, reportsActions } from "../../store";
import SplitButton from "../../common/components/SplitButton";
import { useRestriction } from "../../common/util/permissions";

const ReportFilter = ({
  children,
  handleSubmit,
  handleSchedule,
  showOnly,
  ignoreDevice,
  multiDevice,
  includeGroups,
  loading,
  showExportButton = false,
}) => {
  const dispatch = useDispatch();
  const t = useTranslation();

  const readonly = useRestriction("readonly");

  const devices = useSelector((state) => state.devices.items);
  const groups = useSelector((state) => state.groups.items);

  const deviceId = useSelector((state) => state.devices.selectedId);
  const deviceIds = useSelector((state) => state.devices.selectedIds);
  const groupIds = useSelector((state) => state.reports.groupIds);
  const period = useSelector((state) => state.reports.period);
  const from = useSelector((state) => state.reports.from);
  const to = useSelector((state) => state.reports.to);
  const [button, setButton] = useState("json");
  const [keyword, setKeyword] = useState("");

  const [description, setDescription] = useState();
  const [calendarId, setCalendarId] = useState();

  const scheduleDisabled =
    button === "schedule" && (!description || !calendarId);
  const disabled =
    (!ignoreDevice && !deviceId && !deviceIds.length && !groupIds.length) ||
    scheduleDisabled ||
    loading;

  const handleClick = (type) => {
    if (type === "schedule") {
      handleSchedule(deviceIds, groupIds, {
        description,
        calendarId,
        attributes: {},
      });
    } else {
      let selectedFrom;
      let selectedTo;
      switch (period) {
        case "today":
          selectedFrom = dayjs().startOf("day");
          selectedTo = dayjs().endOf("day");
          break;
        case "yesterday":
          selectedFrom = dayjs().subtract(1, "day").startOf("day");
          selectedTo = dayjs().subtract(1, "day").endOf("day");
          break;
        case "thisWeek":
          selectedFrom = dayjs().startOf("week");
          selectedTo = dayjs().endOf("week");
          break;
        case "previousWeek":
          selectedFrom = dayjs().subtract(1, "week").startOf("week");
          selectedTo = dayjs().subtract(1, "week").endOf("week");
          break;
        case "thisMonth":
          selectedFrom = dayjs().startOf("month");
          selectedTo = dayjs().endOf("month");
          break;
        case "previousMonth":
          selectedFrom = dayjs().subtract(1, "month").startOf("month");
          selectedTo = dayjs().subtract(1, "month").endOf("month");
          break;
        default:
          selectedFrom = dayjs(from, "YYYY-MM-DDTHH:mm");
          selectedTo = dayjs(to, "YYYY-MM-DDTHH:mm");
          break;
      }

      handleSubmit({
        deviceId,
        deviceIds,
        groupIds,
        from: selectedFrom.toISOString(),
        to: selectedTo.toISOString(),
        calendarId,
        type,
      });
    }
  };

  const sortedDevices = Object.values(devices)
    .filter((device) => device.name.toLowerCase().includes(keyword.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));
  const sortedGroups = Object.values(groups).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex-1 flex flex-col min-h-0">

        <Accordion
          defaultExpanded
          disableGutters
          elevation={0}
          className="shadow-none! before:hidden! bg-white dark:bg-[#222427] border! border-gray-300! px-2! rounded-md!"
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} className="px-0! min-h-0! ">
            <Typography variant="h6" className="text-[16px]! font-semibold! text-gray-800! dark:text-gray-200!">Filters</Typography>
          </AccordionSummary>
          <hr className="text-gray-300! dark:text-gray-600! border-gray-200" />
          <AccordionDetails className="flex flex-col p-0! gap-2!">
            {includeGroups && (
              <div className="flex flex-col ">
                <span className="font-medium! text-md text-gray-400">
                  {t("reportGroup")}
                </span>
                <FormControl size="small" fullWidth>
                  <Select
                    multiple
                    value={groupIds}
                    onChange={(e) => dispatch(reportsActions.updateGroupIds(e.target.value))}
                    renderValue={(selected) => selected.map((id) => groups[id]?.name).join(", ")}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                  >
                    {sortedGroups.map((group) => (
                      <MenuItem key={group.id} value={group.id} className="gap-2">
                        <Checkbox checked={groupIds.includes(group.id)} size="small" className="p-0!" />
                        <ListItemText primary={group.name} primaryTypographyProps={{ fontSize: '13px' }} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}

            <div className="flex flex-col ">
              <span className="font-medium! text-md text-gray-400 mb-1">
                {t("reportPeriod")}
              </span>
              <FormControl size="small" fullWidth>
                {/* <InputLabel id="report-period-select-label">
                {t("reportPeriod")}
              </InputLabel> */}
                <Select
                  labelId="report-period-select-label"
                  value={period === "custom" ? "" : period}
                  // label={t("reportPeriod")}
                  onChange={(e) =>
                    dispatch(reportsActions.updatePeriod(e.target.value))
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                >
                  {[
                    "today",
                    "yesterday",
                    "thisWeek",
                    "previousWeek",
                    "thisMonth",
                    "previousMonth",
                  ].map((p) => (
                    <MenuItem key={p} value={p}>
                      {t(`report${p.charAt(0).toUpperCase() + p.slice(1)}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="">
              <FormControlLabel
                value="custom"
                control={<Radio size="small" className="p-1!" />}
                checked={period === "custom"}
                onChange={() => dispatch(reportsActions.updatePeriod("custom"))}
                label={
                  <span className="text-[13px] font-medium text-gray-600">
                    {t("reportCustom")}
                  </span>
                }
                className="m-0! mb-1!"
              />
            </div>

            <div className="flex  gap-3">
              <TextField
                label="from"
                type={period === "custom" ? "datetime-local" : "text"}
                value={period === "custom" ? from : ""}
                disabled={period !== "custom"}
                onChange={(e) => dispatch(reportsActions.updateFrom(e.target.value))}
                variant="outlined"
                size="small"
                InputLabelProps={{ shrink: true }}
                className="flex-1 bg-gray-50/50!"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "" } }}
              />
              <TextField
                label="to"
                type={period === "custom" ? "datetime-local" : "text"}
                value={period === "custom" ? to : ""}
                disabled={period !== "custom"}
                onChange={(e) => dispatch(reportsActions.updateTo(e.target.value))}
                variant="outlined"
                size="small"
                InputLabelProps={{ shrink: true }}
                className="flex-1 bg-gray-50/50!"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "" } }}
              />
            </div>

            {button === "schedule" && (
              <div className="flex flex-col gap-4 mb-4 mt-4">
                <TextField
                  value={description || ""}
                  onChange={(event) => setDescription(event.target.value)}
                  label={t("sharedDescription")}
                  fullWidth
                  size="small"
                  variant="outlined"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
                <TextField
                  select
                  value={calendarId || ""}
                  onChange={(event) => setCalendarId(Number(event.target.value))}
                  label={t("sharedCalendar")}
                  fullWidth
                  size="small"
                  variant="outlined"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                >
                  {/* Calendar items would go here, simplified for now */}
                </TextField>
              </div>
            )}

            {children && <div className="mb-3 pt-5">{children}</div>}
          </AccordionDetails>
        </Accordion>

        {/* <hr className="text-gray-300 dark:text-gray-600" /> */}

        {!ignoreDevice && (
          <div className="flex flex-col flex-1 min-h-0">
            <TextField
              label={t("search")}
              type="text"
              placeholder="Search devices or groups"
              className="w-full my-2!"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <span className="font-medium! text-sm text-gray-400 mb-1">
              {t(multiDevice ? "deviceTitle" : "reportDevice")}
            </span>
            <div className="flex-1 overflow-y-auto pr-2 min-h-[160px]">
              {sortedDevices.map((device) => (
                <div key={device.id} className="flex items-center mb-1">
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={
                          multiDevice
                            ? deviceIds.includes(device.id)
                            : deviceId === device.id
                        }
                        onChange={(e) => {
                          if (multiDevice) {
                            const newIds = e.target.checked
                              ? [...deviceIds, device.id]
                              : deviceIds.filter((id) => id !== device.id);
                            dispatch(devicesActions.selectIds(newIds));
                          } else {
                            dispatch(
                              devicesActions.selectId(
                                e.target.checked ? device.id : null,
                              ),
                            );
                          }
                        }}
                        className="p-1!"
                      />
                    }
                    label={
                      <span className="text-[13px] font-medium text-gray-600">
                        {device.name}
                      </span>
                    }
                    className="m-0!"
                  />
                </div>
              ))}
            </div>
            {/* <div className="h-px bg-gray-50 my-4" /> */}
          </div>
        )}
      </div>

      <div className="shrink-0 pb-4 pt-2 sticky bottom-0 bg-white dark:bg-[#222427]">
        {showExportButton ? (
          <SplitButton
            fullWidth
            variant="contained"
            disabled={disabled}
            onClick={handleClick}
            options={{
              json: t("reportShow"),
              export: "Export",
              mail: "Email Report",
              schedule: "Schedule",
            }}
            selected={button}
            setSelected={setButton}
          />
        ) : (
          <Button
            fullWidth
            variant="contained"
            disabled={disabled}
            onClick={() => handleClick(button)}
            className="bg-[#1a1a1a]! text-white! dark:text-black! dark:bg-white! rounded-full! py-4! normal-case! font-bold!  hover:bg-black! dark:hover:bg-gray-200! transition-transform!"
          >
            {t(loading ? "sharedLoading" : "reportShow")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ReportFilter;
