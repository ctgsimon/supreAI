import React, { useState, useEffect } from 'react';
import { Avatar } from '@douyinfe/semi-ui';

// Cache for loaded icons
const iconCache = {};

// Lazy load LobeHub icons
const LazyLobeIcon = ({ iconName, size = 14, ...props }) => {
  const [IconComponent, setIconComponent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadIcon = async () => {
      if (!iconName) {
        setLoading(false);
        return;
      }

      const trimmedName = String(iconName).trim();
      if (!trimmedName) {
        setLoading(false);
        return;
      }

      // Check cache first
      if (iconCache[trimmedName]) {
        if (isMounted) {
          setIconComponent(() => iconCache[trimmedName]);
          setLoading(false);
        }
        return;
      }

      try {
        // Dynamically import @lobehub/icons
        const LobeIcons = await import('@lobehub/icons');

        // Parse icon name (e.g., "OpenAI.Avatar.type={'platform'}")
        const segments = trimmedName.split('.');
        const baseKey = segments[0];
        const BaseIcon = LobeIcons[baseKey];

        let Component = null;
        let propStartIndex = 1;

        if (BaseIcon && segments.length > 1 && BaseIcon[segments[1]]) {
          Component = BaseIcon[segments[1]];
          propStartIndex = 2;
        } else {
          Component = LobeIcons[baseKey];
        }

        // Parse additional props from dot notation
        const additionalProps = {};
        for (let i = propStartIndex; i < segments.length; i++) {
          const seg = segments[i];
          if (!seg) continue;
          const eqIdx = seg.indexOf('=');
          if (eqIdx === -1) {
            additionalProps[seg.trim()] = true;
            continue;
          }
          const key = seg.slice(0, eqIdx).trim();
          const valRaw = seg.slice(eqIdx + 1).trim();
          // Parse value
          let val = valRaw;
          if (val.startsWith('{') && val.endsWith('}')) {
            val = val.slice(1, -1).trim();
          }
          if ((val.startsWith('"') && val.endsWith('"')) ||
              (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          } else if (val === 'true') {
            val = true;
          } else if (val === 'false') {
            val = false;
          } else if (/^-?\d+(?:\.\d+)?$/.test(val)) {
            val = Number(val);
          }
          additionalProps[key] = val;
        }

        // Merge props
        const finalProps = { size, ...additionalProps, ...props };

        // Create wrapper component
        const IconWrapper = (wrapperProps) => {
          if (!Component) return null;
          return <Component {...finalProps} {...wrapperProps} />;
        };

        // Cache the component
        iconCache[trimmedName] = IconWrapper;

        if (isMounted) {
          setIconComponent(() => IconWrapper);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to load icon:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadIcon();

    return () => {
      isMounted = false;
    };
  }, [iconName, size]);

  if (loading) {
    return <Avatar size='extra-extra-small'>...</Avatar>;
  }

  if (!IconComponent) {
    const firstLetter = String(iconName).charAt(0).toUpperCase();
    return <Avatar size='extra-extra-small'>{firstLetter}</Avatar>;
  }

  return <IconComponent {...props} />;
};

export default LazyLobeIcon;
