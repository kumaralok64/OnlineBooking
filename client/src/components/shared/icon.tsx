import { useState } from "react";
import { Eye, EyeOff } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface IconProps {
  field: any; 
}

const Icon: React.FC<IconProps> = ({ field }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <div className="flex items-center w-full justify-end">
        <Input
          type={showPassword ? 'text' : 'password'}
          className="shad-input"
          {...field}
        />
        <div className="absolute mr-3 eyeIcon-fill">
          {showPassword ? (
            <Eye onClick={() => setShowPassword(false)} />
          ) : (
            <EyeOff onClick={() => setShowPassword(true)} />
          )}
        </div>
      </div>
    </>
  );
}

export default Icon;
