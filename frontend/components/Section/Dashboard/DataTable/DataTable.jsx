import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { COLORS } from "../theme/colors";

/*
 * columns: [{ key, label, align?, render?(row) }]
 * rows:    array of objects
 */
export default function DataTable({ columns, rows, rowKey }) {
    return (
        <TableContainer sx={{ overflowX: "auto" }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        {columns.map((c) => (
                            <TableCell
                                key={c.key}
                                align={c.align || "left"}
                                sx={{
                                    fontWeight: 700,
                                    fontSize: 12.5,
                                    color: COLORS.text,
                                    bgcolor: COLORS.headBg,
                                    borderColor: COLORS.border,
                                    py: 0.75,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {c.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, i) => (
                        <TableRow
                            key={rowKey ? row[rowKey] : i}
                            sx={{ "&:last-child td": { borderBottom: 0 } }}
                        >
                            {columns.map((c) => (
                                <TableCell
                                    key={c.key}
                                    align={c.align || "left"}
                                    sx={{
                                        fontSize: 12.5,
                                        color: COLORS.text,
                                        borderColor: COLORS.border,
                                        py: 1,
                                    }}
                                >
                                    {c.render ? c.render(row) : row[c.key]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
