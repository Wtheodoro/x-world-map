import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import qs from 'qs'

import useAuthContext from '@contexts/Auth'
import useAppContext from '@contexts/App'

import Form from '@components/Form'
import InputField from '@components/InputField'
import InputLabel from '@components/InputLabel'
import InputError from '@components/InputError'
import Button from '@components/Button'
import ImagesSelector from '@components/ImagesSelector'

import { normalizeProfileApiData } from '@lib/profiles'
import { ENDPOINTS } from '@lib/constants'

import * as styles from './ProfileForm.module.css'

const ProfileForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const { state: { profile }, actions: { setProfile } } = useAuthContext()
  const { state: { features }, actions: { refetchCollections } } = useAppContext()
  const [apiSuccess, setApiSuccess] = useState()
  const [apiError, setApiError] = useState()
  const [avatar, setAvatar] = useState()

  const onSubmit = useCallback(async ({
    name,
    about,
    website,
    github,
    stackoverflow,
    linkedin,
    twitter,
    instagram,
  }) => {
    setApiSuccess()
    setApiError()
    try {
      const queryProfile = qs.stringify({ populate: ['avatar', 'locations'] })
      const { data: apiData } = await axios.put(`${ENDPOINTS.PROFILES}/${profile.id}?${queryProfile}`, {
        data: {
          name,
          about,
          website,
          github,
          stackoverflow,
          linkedin,
          twitter,
          instagram,
        }
      })
      const updatedProfile = normalizeProfileApiData(apiData.data)
      setProfile(updatedProfile)
      setApiSuccess('Your profile was updated!')
      refetchCollections()
    } catch (error) {
      console.error(error)
      setApiError(error?.response?.data?.error?.message)
    }
  }, [profile, refetchCollections, setProfile])

  const handleSetAvatarFile = files => {
    // TO DO: add image uploading to the profile entry
    // https://docs.strapi.io/developer-docs/latest/plugins/upload.html
    console.log(files)
    if (files.length > 0) {
      setAvatar(files[0])
    }
  }

  return (
    <Form
      title={`Hello ${profile.name}`}
      onSubmit={handleSubmit(onSubmit)}
      successMessage={apiSuccess}
      errorMessage={apiError}
      className={styles.component}
    >
      <InputLabel title="Full name:" isRequired>
        <InputField
          type="text"
          register={register('name', { required: true })}
          defaultValue={profile.name}
          disabled={isSubmitting}
        />
        <InputError hasError={errors.name}>This field is required.</InputError>
      </InputLabel>
      {features?.AVATAR_UPLOAD && (
        <ImagesSelector
          title="Profile picture:"
          images={[profile.avatar]}
          selectFiles={handleSetAvatarFile}
        />
      )}
      <InputLabel title="About me:">
        <InputField
          type="text"
          register={register('about')}
          defaultValue={profile.about}
          disabled={isSubmitting}
        />
      </InputLabel>
      <InputLabel title="Website:">
        <InputField
          type="text"
          register={register('website')}
          defaultValue={profile.website}
          disabled={isSubmitting}
        />
      </InputLabel>
      <InputLabel title="GitHub:">
        <InputField
          type="text"
          register={register('github')}
          defaultValue={profile.github}
          disabled={isSubmitting}
        />
      </InputLabel>
      <InputLabel title="StackOverflow:">
        <InputField
          type="text"
          register={register('stackoverflow')}
          defaultValue={profile.stackoverflow}
          disabled={isSubmitting}
        />
      </InputLabel>
      <InputLabel title="LinkedIn:">
        <InputField
          type="text"
          register={register('linkedin')}
          defaultValue={profile.linkedin}
          disabled={isSubmitting}
        />
      </InputLabel>
      <InputLabel title="Twitter:">
        <InputField
          type="text"
          register={register('twitter')}
          defaultValue={profile.twitter}
          disabled={isSubmitting}
        />
      </InputLabel>
      <InputLabel title="Instagram:">
        <InputField
          type="text"
          register={register('instagram')}
          defaultValue={profile.instagram}
          disabled={isSubmitting}
        />
      </InputLabel>
      <Button type="submit" wide disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </Button>
    </Form>
  )
}

export default ProfileForm
