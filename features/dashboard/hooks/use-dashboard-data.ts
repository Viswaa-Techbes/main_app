"use client";

import { useEffect, useState } from "react";

import { AppError } from "@/core/errors/app-error";
import { logger } from "@/core/logging/logger";
import { dashboardService, DashboardData } from "@/features/dashboard/services/dashboard-service";

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function load() {
      try {
        setIsLoading(true);
        const response = await dashboardService.getDashboardData();

        if (!isActive) {
          return;
        }

        setData(response);
        setError(null);
      } catch (error) {
        logger.error("Failed to load dashboard data", error);

        if (!isActive) {
          return;
        }

        setError(error instanceof AppError ? error.message : "Unable to load dashboard data.");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      isActive = false;
    };
  }, []);

  return {
    data,
    isLoading,
    error,
  };
}
