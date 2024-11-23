import React, { useState, useEffect } from "react";
import { Skeleton } from "antd";
import { AvatarSeeds } from 'src/constants';

// Hàm chọn ngẫu nhiên một giá trị từ mảng AvatarSeeds
const getRandomAvatarSeed = () => {
  const randomIndex = Math.floor(Math.random() * AvatarSeeds.length);
  return AvatarSeeds[randomIndex];
};

export const AvatarComponent = () => {
  const [loadingState, setLoadingState] = useState({
    avatarLoading: true,
    otherDataLoading: true,
  });

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const randomSeed = getRandomAvatarSeed();
    const avatarApiUrl = `https://api.dicebear.com/9.x/glass/svg?seed=${randomSeed}`;

    setLoadingState((prev) => ({ ...prev, avatarLoading: true }));

    fetch(avatarApiUrl)
      .then((response) => response.text())
      .then(() => {
        setAvatarUrl(avatarApiUrl);
        setLoadingState((prev) => ({ ...prev, avatarLoading: false }));
      })
      .catch(() => {
        setLoadingState((prev) => ({ ...prev, avatarLoading: false }));
      });
  }, []);

  return (
    <div>
      {loadingState.avatarLoading ? (
        // Sử dụng Skeleton để thay thế ảnh khi đang tải
        <Skeleton.Avatar active size="large" />
      ) : (
        <img src={avatarUrl ?? ''}  alt="Random Avatar" />
      )}
    </div>
  );
};
