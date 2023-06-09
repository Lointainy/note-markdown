import { useState } from 'react'

/* Store */
import { useCreateNoteMutation } from '../../../store/reducers/noteApi'

/* Styles */
import style from './AddNewNote.module.scss'

/* Icons */
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'

/* Components */
import Input from '../../Standard/Input/Input'

/* Utils */
import { patternFilterTitle, patternNoteTitle } from '../../../utils/patterns'

/* Default */

const defaultForm = {
	title: '',
	body: '',
	filters: ['Default']
}

export default function AddNewNote({ closeModal }) {
	const [form, setForm] = useState(defaultForm)

	const [newFilter, setNewFilter] = useState('')

	const [createNote] = useCreateNoteMutation()

	const handleChange = (e) => {
		if (e.target.name === 'newFilter') {
			setNewFilter(e.target.value)
		} else {
			setForm((prev) => ({
				...prev,
				[e.target.name]: e.target.value
			}))
		}
	}

	const handleDeleteFilter = (name) => {
		let updatedFilters = form.filters.filter((f) => f !== name)
		if (updatedFilters) {
			setForm((prev) => ({ ...prev, filters: updatedFilters }))
		}
	}

	const handleAddFilter = () => {
		const regex = /^[A-Za-zА-Яа-яІіЇїЄєҐґ]{3,24}$/u
		if (regex.test(newFilter) === true) {
			let updatedFilters = [...form.filters, newFilter]
			if (updatedFilters) {
				setForm((prev) => ({ ...prev, filters: updatedFilters }))
				setNewFilter('')
			}
		} else {
			return
		}
	}

	const handleSubmitForm = (e) => {
		e.preventDefault()
		const newNote = { ...form, body: form.title }
		createNote(newNote)
		closeModal()
	}

	return (
		<form className={style.form} onSubmit={handleSubmitForm}>
			<Input
				required={true}
				label={'title'}
				name={'title'}
				value={form.title}
				pattern={patternNoteTitle}
				placeholder={'Enter the title'}
				errorMessage={'Wrong format'}
				onChange={handleChange}
				autoFocus={true}
				tooltip={'without number and spec symbols'}
			/>
			<div className={style.filters}>
				<div className={style.add}>
					<Input
						label={'New Filter'}
						name={'newFilter'}
						value={newFilter}
						pattern={patternFilterTitle}
						placeholder={'Enter the Filter'}
						onChange={handleChange}
						errorMessage={'Wrong format'}
						tooltip={'without number, space and spec symbols'}
					/>
					<button type="button" className={style.add__btn} onClick={handleAddFilter}>
						<Icon icon={'plus'} />
					</button>
				</div>
				<ul className={style.filters__list}>
					{form.filters.map((filter, index) => {
						return (
							<li key={index} className={style.filters__item}>
								{filter}
								<div className={style.delete} onClick={() => handleDeleteFilter(filter)}>
									<Icon icon="minus" />
								</div>
							</li>
						)
					})}
				</ul>
			</div>

			<button type="submit" className={style.create}>
				Create Note
			</button>
		</form>
	)
}

