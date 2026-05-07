import React, { useState } from "react";
import { useSelector } from "react-redux";

import {
  Typography,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useEffectAsync } from "../reactHelper";
import { useTranslation } from "../common/components/LocalizationProvider";
import PositionValue from "../common/components/PositionValue";
import usePositionAttributes from "../common/attributes/usePositionAttributes";

const PositionPage = () => {
  const navigate = useNavigate();
  const t = useTranslation();

  const positionAttributes = usePositionAttributes(t);

  const { id } = useParams();

  const [item, setItem] = useState();

  useEffectAsync(async () => {
    if (id) {
      const response = await fetch(`/api/positions?id=${id}`);
      if (response.ok) {
        const positions = await response.json();
        if (positions.length > 0) {
          setItem(positions[0]);
        }
      } else {
        throw Error(await response.text());
      }
    }
  }, [id]);

  const deviceName = useSelector((state) => {
    if (item) {
      const device = state.devices.items[item.deviceId];
      if (device) {
        return device.name;
      }
    }
    return null;
  });

  return (
    <div className="h-full flex flex-col bg-[#f8f9fa] dark:bg-[#222427] overflow-hidden md:pl-20">
      <div className="shrink-0 px-4 pt-4 pb-2">
        <div className="bg-white dark:bg-[#222427] rounded-full shadow-md border border-gray-100 dark:border-[#333] px-4 py-3 flex items-center gap-2">
          <Typography variant="h6" className="font-semibold!">
            {deviceName || t("stateTitle")}
          </Typography>
        </div>
      </div>
      <div className="flex-1 min-h-0 p-4 pt-2">
        <div className="h-full bg-white dark:bg-[#222427] rounded-4xl shadow-md border border-gray-100 dark:border-[#333] overflow-auto p-4">
          <Table sx={{ minWidth: 720 }}>
            <TableHead>
              <TableRow>
                <TableCell>{t("stateName")}</TableCell>
                <TableCell>{t("sharedName")}</TableCell>
                <TableCell>{t("stateValue")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {item &&
                Object.getOwnPropertyNames(item)
                  .filter((it) => it !== "attributes")
                  .map((property) => (
                    <TableRow key={property}>
                      <TableCell>{property}</TableCell>
                      <TableCell>
                        <strong>{positionAttributes[property]?.name}</strong>
                      </TableCell>
                      <TableCell>
                        <PositionValue position={item} property={property} />
                      </TableCell>
                    </TableRow>
                  ))}
              {item &&
                Object.getOwnPropertyNames(item.attributes || {}).map(
                  (attribute) => (
                    <TableRow key={attribute}>
                      <TableCell>{attribute}</TableCell>
                      <TableCell>
                        <strong>{positionAttributes[attribute]?.name}</strong>
                      </TableCell>
                      <TableCell>
                        <PositionValue position={item} attribute={attribute} />
                      </TableCell>
                    </TableRow>
                  ),
                )}
              {!item && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    {t("sharedLoading")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default PositionPage;
