import React, { useContext, useEffect, useState } from 'react';
import { useUserAuth } from '../../hooks/useUserAuth';
import { userContext } from '../../context/userContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../Utils/axiosInstance';
import { API_PATHS } from '../../Utils/apiPath';
import moment from 'moment';
import InfoCard from '../../Components/Cards/InfoCard';
import { IoMdCard } from 'react-icons/io';
import { addThousandsSeperator } from '../../Utils/helper';
import { LuArrowRight } from 'react-icons/lu';
import TaskListTable from '../../layouts/TaskListTable';

const Dashboard = () => {
  // Check user authentication
  useUserAuth();
  const { user } = useContext(userContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  // Navigation function for "See All" button
  const onSeeMore = () => {
    navigate('/admin/tasks');
  };

  // Render a loading state if data is not yet available
  if (loading) {
    return (
      <DashboardLayout activeMenu="Dashboard">
        <div className="text-center py-20">
          <p>Loading Dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="bg-white p-6 rounded-2xl my-5 shadow-md shadow-gray-100 border border-gray-200/50">
        <div>
          <div className="col-span-3">
            <h2 className="text-xl md:text-2xl">Good Morning! {user?.name}</h2>
            <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
              {moment().format('dddd Do MMM YYYY')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Tasks"
            value={addThousandsSeperator(
              dashboardData?.charts?.taskDistribution?.All || 0
            )}
            color="bg-blue-500"
          />
          <InfoCard
            icon={<IoMdCard />}
            label="Pending Tasks"
            value={addThousandsSeperator(
              dashboardData?.charts?.taskDistribution?.Pending || 0
            )}
            color="bg-violet-500"
          />
          <InfoCard
            icon={<IoMdCard />}
            label="In Progress"
            value={addThousandsSeperator(
              dashboardData?.charts?.taskDistribution?.InProgress || 0
            )}
            color="bg-cyan-500"
          />
          <InfoCard
            icon={<IoMdCard />}
            label="Completed Tasks"
            value={addThousandsSeperator(
              dashboardData?.charts?.taskDistribution?.Completed || 0
            )}
            color="bg-lime-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-2xl my-5 shadow-md shadow-gray-100 border border-gray-200/50">
            <div className="flex items-center justify-between">
              <h5 className="text-lg">Recent Tasks</h5>
              <button
                className="cursor-pointer flex items-center gap-3 text-xl font-medium text-red-700 hover:text-blue-500 bg-gray-50 hover:bg-blue-50 px-4 py-1.5 rounded-lg border border-gray-200/50"
                onClick={onSeeMore}
              >
                See All <LuArrowRight className="text-base" />
              </button>
            </div>
            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
