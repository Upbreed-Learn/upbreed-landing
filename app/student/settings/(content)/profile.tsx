import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useField, useForm } from '@tanstack/react-form';
import z from 'zod';
import { Country, State } from 'country-state-city';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'First name should be at least 2 characters' }),
  lastName: z
    .string()
    .min(2, { message: 'Last name should be at least 2 characters' }),
  country: z.string().min(2, { message: 'Country cannot be blank' }),
  state: z.string().min(2, { message: 'State cannot be blank' }),
  website: z.url({ message: 'Invalid! URL should start with https://' }),
  twitter: z.url({ message: 'Invalid! URL should start with https://' }),
  instagram: z.url({ message: 'Invalid! URL should start with https://' }),
  linkedIn: z.url({ message: 'Invalid! URL should start with https://' }),
});

const Profile = () => {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      country: '',
      state: '',
      website: '',
      twitter: '',
      instagram: '',
      linkedIn: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  const country = useField({
    form,
    name: 'country',
  }).state.value;

  const countries = Country.getAllCountries().map(country => ({
    label: country.name,
    value: country.isoCode,
    flag: country.flag,
  }));

  const states = State.getStatesOfCountry(country).map(state => ({
    label: state.name,
    value: state.isoCode,
  }));

  return (
    <form
      id="profile-form"
      onSubmit={e => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex w-full flex-col gap-6"
    >
      <FieldGroup>
        <form.Field
          name="firstName"
          children={field => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldContent className="flex-row items-center">
                  <FieldLabel
                    htmlFor={field.name}
                    className="flex-1/6 text-sm/[100%] font-semibold text-nowrap text-black"
                  >
                    First Name:
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className="flex-5/6 border-none bg-[#F2F2F2]"
                  />
                </FieldContent>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="lastName"
          children={field => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldContent className="flex-row items-center">
                  <FieldLabel
                    htmlFor={field.name}
                    className="flex-1/6 text-sm/[100%] font-semibold text-nowrap text-black"
                  >
                    Last Name:
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className="flex-5/6 border-none bg-[#F2F2F2]"
                  />
                </FieldContent>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="country"
          children={field => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldContent className="flex-row items-center">
                  <FieldLabel
                    htmlFor={field.name}
                    className="flex-1/6 text-sm/[100%] font-semibold text-black"
                  >
                    Country:
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger
                      id="select-country"
                      aria-invalid={isInvalid}
                      className="flex-5/6 border-none bg-[#F2F2F2]"
                    >
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      {countries.map(country => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.flag} {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldContent>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="state"
          children={field => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldContent className="flex-row items-center">
                  <FieldLabel
                    htmlFor={field.name}
                    className="flex-1/6 text-sm/[100%] font-semibold text-black"
                  >
                    State:
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    disabled={country === ''}
                  >
                    <SelectTrigger
                      id="select-state"
                      aria-invalid={isInvalid}
                      className="flex-5/6 border-none bg-[#F2F2F2]"
                    >
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      {states.map(state => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldContent>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <FieldSet className="flex flex-row items-end">
          <FieldLabel className="flex-1/6 text-sm/[100%] font-semibold text-black">
            Links
          </FieldLabel>
          <FieldSeparator className="flex-5/6" />
        </FieldSet>
        <form.Field
          name="website"
          children={field => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldContent className="flex-row items-center">
                  <FieldLabel
                    htmlFor={field.name}
                    className="flex-1/6 text-sm/[100%] font-semibold text-black"
                  >
                    Website:
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className="flex-5/6 border-none bg-[#F2F2F2]"
                  />
                </FieldContent>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="twitter"
          children={field => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldContent className="flex-row items-center">
                  <FieldLabel
                    htmlFor={field.name}
                    className="flex-1/6 text-sm/[100%] font-semibold text-black"
                  >
                    X:
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className="flex-5/6 border-none bg-[#F2F2F2]"
                  />
                </FieldContent>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="instagram"
          children={field => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldContent className="flex-row items-center">
                  <FieldLabel
                    htmlFor={field.name}
                    className="flex-1/6 text-sm/[100%] font-semibold text-black"
                  >
                    Instagram:
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className="flex-5/6 border-none bg-[#F2F2F2]"
                  />
                </FieldContent>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="linkedIn"
          children={field => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldContent className="flex-row items-center">
                  <FieldLabel
                    htmlFor={field.name}
                    className="flex-1/6 text-sm/[100%] font-semibold text-black"
                  >
                    LinkedIn:
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className="flex-5/6 border-none bg-[#F2F2F2]"
                  />
                </FieldContent>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <Button className="w-max self-end">Update</Button>
      </FieldGroup>
    </form>
  );
};

export default Profile;
