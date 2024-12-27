import React from 'react';
import {
  Button,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';

interface ProfileProps {
  userType: 'farmer' | 'buyer';
  profileData: FarmerProfile | BuyerProfile;
  onUpdate: (data: Partial<FarmerProfile | BuyerProfile>) => void;
}

interface FarmerProfile {
  farmName: string;
  location: string;
  phoneNumber: string;
  farmSize?: number;
}

interface BuyerProfile {
  businessName?: string;
  phoneNumber: string;
  preferredProducts?: string;
}

const ProfileForm: React.FC<ProfileProps> = ({ userType, profileData, onUpdate }) => {
  const form = useForm({
    initialValues: profileData,
    validate: {
      phoneNumber: (val: string) => (/^\+?\d{10,15}$/.test(val) ? null : 'Invalid phone number'),
      ...(userType === 'farmer' && {
        farmName: (val: string) => (val.length > 0 ? null : 'Farm Name is required'),
        location: (val: string) => (val.length > 0 ? null : 'Location is required'),
      }),
      ...(userType === 'buyer' && {
        businessName: (val?: string) => (val && val.length > 0 ? null : 'Business Name is required'),
      }),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    onUpdate(values);
  };

  return (
    <Paper radius="md" p="xl" withBorder>
      <Text size="lg"  mb="lg">
        {userType === 'farmer' ? 'Farmer Profile' : 'Buyer Profile'}
      </Text>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {userType === 'farmer' && (
            <>
              <TextInput
                label="Farm Name"
                placeholder="Farm Name"
                value={userType === 'farmer' ? (form.values as FarmerProfile).farmName : ''}
                onChange={(event) => form.setFieldValue('farmName', event.currentTarget.value)}
                error={form.errors.farmName}
              />
              <TextInput
                label="Location"
                placeholder="Location"
                value={userType === 'farmer' ? (form.values as FarmerProfile).location : ''}
                onChange={(event) => form.setFieldValue('location', event.currentTarget.value)}
                error={form.errors.location}
              />
              <TextInput
                label="Farm Size (in acres/hectares)"
                placeholder="Farm Size"
                value={userType === 'farmer' ? (form.values as FarmerProfile).farmSize?.toString() || '' : ''}
                onChange={(event) => userType === 'farmer' && form.setFieldValue('farmSize', parseFloat(event.currentTarget.value))}
              />
            </>
          )}

          {userType === 'buyer' && (
            <>
              <TextInput
                label="Business Name"
                placeholder="Business Name"
                value={(form.values as BuyerProfile).businessName || ''}
                onChange={(event) => form.setFieldValue('businessName', event.currentTarget.value)}
                error={form.errors.businessName}
              />
              <TextInput
                label="Preferred Products"
                placeholder="Preferred Products"
                value={(form.values as BuyerProfile).preferredProducts || ''}
                onChange={(event) => form.setFieldValue('preferredProducts', event.currentTarget.value)}
              />
            </>
          )}

          <TextInput
            label="Phone Number"
            placeholder="Phone Number"
            value={form.values.phoneNumber}
            onChange={(event) => form.setFieldValue('phoneNumber', event.currentTarget.value)}
            error={form.errors.phoneNumber}
          />
        </Stack>

        <Group  mt="lg">
          <Button type="submit">Update Profile</Button>
          <Button style={{color: 'black', backgroundColor:'red'}}> DELETE ACCOUNT</Button>
        </Group>
      </form>
    </Paper>
  );
};

export default ProfileForm;
